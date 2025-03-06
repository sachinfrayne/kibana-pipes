import type { IRouter } from '@kbn/core/server';
import type { Logger } from '@kbn/core/server';
import { sortLines } from '../pipe_functions/sort';
import { decode } from '../string_functions/request_decoder';

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

      const url = request.url.toString();

      const [elasticRequestURLDecoded, elasticQueryStringURLDecoded, kibanaPipeCommandURLDecoded] =
        decode(url);

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
  );
}
