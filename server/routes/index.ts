import type { ElasticsearchClient, IRouter, KibanaResponseFactory } from '@kbn/core/server';
import type { Logger } from '@kbn/core/server';
import { processKibanaPipes } from '../pipe_functions/pipe_function_runner';
import { isCatRequest, hasCatHeader, parseKibanaRequest } from '../string_functions/request_parser';

async function getEsResponse(
  kibanaRequest: string,
  esClient: ElasticsearchClient,
  response: KibanaResponseFactory,
  logger: Logger
) {
  const [elasticRequest, elasticQueryString, kibanaPipeCommand] = parseKibanaRequest(kibanaRequest);

  const method = 'GET';

  try {
    const elasticResponse = await esClient.transport.request({
      path: elasticRequest,
      method,
      querystring: elasticQueryString,
    });

    const elasticResponseString =
      typeof elasticResponse === 'string' ? elasticResponse : JSON.stringify(elasticResponse);

    const catCommand = isCatRequest(elasticRequest);
    const catHeader = catCommand ? hasCatHeader(elasticQueryString) : false;

    const modifiedResponse = processKibanaPipes(
      kibanaPipeCommand,
      elasticResponseString,
      catHeader,
      catCommand
    );

    if (catCommand) {
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

      const url = decodeURIComponent(request.url.toString()).replace(/=$/, '');
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
