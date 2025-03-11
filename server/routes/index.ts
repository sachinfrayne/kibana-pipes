import type { ElasticsearchClient, IRouter, KibanaResponseFactory } from '@kbn/core/server';
import type { Logger } from '@kbn/core/server';
import { processKibanaPipes } from '../pipe_functions/pipe_function_runner';
import { parseKibanaRequest } from '../string_functions/request_parser';

async function getEsResponse(
  kibanaRequest: string,
  esClient: ElasticsearchClient,
  response: KibanaResponseFactory,
  logger: Logger
) {
  const [elasticRequest, elasticQueryString, kibanaPipeCommand] =
    parseKibanaRequest(kibanaRequest);

  const method = 'GET';
  let catHeader = false;
  let catCommand = false;

  try {
    let elasticResponse = await esClient.transport.request({
      path: elasticRequest,
      method,
      querystring: elasticQueryString,
    });

    let elasticResponseString =
      typeof elasticResponse === 'string' ? elasticResponse : JSON.stringify(elasticResponse);

    if (elasticRequest.startsWith('/_cat')) {
      catCommand = true;
    }

    if (
      elasticQueryString.startsWith('v') ||
      elasticQueryString.includes('&v')
    ) {
      catHeader = true;
    }

    const modifiedResponse = processKibanaPipes(
      kibanaPipeCommand,
      elasticResponseString,
      catHeader,
      catCommand
    );

    if (elasticRequest.startsWith('/_cat')) {
      return response.ok({
        body: modifiedResponse,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      return response.ok({
        body: modifiedResponse,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    logger.error(`Error in /api/kp: ${error.message}`);
    return response.customError({
      statusCode: error.statusCode || 500,
      body: error.message,
    });
  }
}

export function defineRoutes(router: IRouter, logger: Logger) {
  router.get(
    {
      path: '/api/kp',
      validate: {
        query: (value, { ok, badRequest }) => {
          if (typeof value.request === 'string') {
            return ok(value);
          }
          return badRequest('Invalid request payload');
        },
      },
    },
    async (context, request, response) => {
      const coreContext = await context.core;
      const esClient = coreContext.elasticsearch.client.asCurrentUser;

      let url = request.url.toString();
      url = decodeURIComponent(url);
      url = url.endsWith('=') ? url.slice(0, -1) : url;
      const [, kibanaRequest] = url.split('?request=');

      return await getEsResponse(kibanaRequest, esClient, response, logger);
    }
  );

  router.post(
    {
      path: '/api/kp',
      validate: {
        body: (value, { ok, badRequest }) => {
          if (typeof value.request === 'string') {
            return ok(value);
          }
          return badRequest('Invalid request payload');
        },
      },
    },
    async (context, request, response) => {
      const coreContext = await context.core;
      const esClient = coreContext.elasticsearch.client.asCurrentUser;

      const kibanaRequest = request.body.request.replace(/\+/g, ' ');

      return await getEsResponse(kibanaRequest, esClient, response, logger);
    }
  );
}
