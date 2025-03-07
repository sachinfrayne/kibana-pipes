import type { ElasticsearchClient, IRouter, KibanaResponseFactory } from '@kbn/core/server';
import type { Logger } from '@kbn/core/server';
import { sortLines } from '../pipe_functions/sort';
import { parseKibanaRequest } from '../string_functions/request_parser';

function processKibanaPipes(
  kibanaPipeCommandURLDecoded: string,
  modifiedResponse: string,
  catHeader: boolean
) {
  if (kibanaPipeCommandURLDecoded) {
    const [command, ...args] = kibanaPipeCommandURLDecoded.split(' ');
    switch (command) {
      case 'sort':
        modifiedResponse = sortLines(modifiedResponse, args, catHeader);
        break;
      default:
        break;
    }
  }
  return modifiedResponse;
}

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

    let modifiedResponse =
      typeof elasticResponse === 'string' ? elasticResponse : JSON.stringify(elasticResponse);

    if (
      elasticQueryStringURLDecoded.startsWith('v') ||
      elasticQueryStringURLDecoded.includes('&v')
    ) {
      catHeader = true;
    }

    modifiedResponse = processKibanaPipes(kibanaPipeCommandURLDecoded, modifiedResponse, catHeader);

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

      const kibanaRequest = request.body.request;

      return await getEsResponse(kibanaRequest, esClient, response, logger);
    }
  );
}
