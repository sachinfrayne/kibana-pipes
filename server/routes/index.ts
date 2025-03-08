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
  const [elasticRequestURLDecoded, elasticQueryStringURLDecoded, kibanaPipeCommandURLDecoded] =
    parseKibanaRequest(kibanaRequest);

  const method = 'GET';
  var catHeader = false;

  try {
    const elasticResponse = await esClient.transport.request({
      path: elasticRequestURLDecoded,
      method,
      querystring: elasticQueryStringURLDecoded,
    });

    // TODO: find a better name for `preModifiedResponse`
    let preModifiedResponse =
      typeof elasticResponse === 'string' ? elasticResponse : JSON.stringify(elasticResponse);

    if (
      elasticQueryStringURLDecoded.startsWith('v') ||
      elasticQueryStringURLDecoded.includes('&v')
    ) {
      catHeader = true;
    }

    const modifiedResponse = processKibanaPipes(
      kibanaPipeCommandURLDecoded,
      preModifiedResponse,
      catHeader
    );

    return response.ok({
      body: modifiedResponse,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    logger.error(`Error in /api/kp: ${error.message}`);
    return response.customError({
      statusCode: error.statusCode || 500,
      body: error.message,
    });
  }
}

export function defineRoutes(router: IRouter, logger: Logger) {
  // TODO: Is it possible to grab any command that is meant for elasticsearch
  // and run it through this plugin? this way we can have cleaner commands in
  // dev tools
  // e.g. GET _cat/tasks?human&v|sort+-r
  // instead of
  // GET kbn:/api/kp?request=/_cat/tasks?human&v|sort+-r

  // TODO: explore if there is a way to have spaces in the request
  // e.g. GET kbn:/api/kp?request=/_cat/tasks?human&v|sort -r
  // instead of
  // GET kbn:/api/kp?request=/_cat/tasks?human&v|sort%20-r
  // Likely not without a new console shell

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

      logger.info("url: " + url)

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

      const kibanaRequest = request.body.request;
      logger.info("request: " + kibanaRequest)

      return await getEsResponse(kibanaRequest, esClient, response, logger);
    }
  );
}
