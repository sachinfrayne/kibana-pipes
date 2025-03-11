import { sort } from './sort';
import { sed } from './sed';
import { badRequest } from '@hapi/boom';

export function processKibanaPipes(
  kibanaPipeCommandURLDecoded: string,
  modifiedResponse: string,
  catHeader: boolean,
  catCommand: boolean
) {
  if (kibanaPipeCommandURLDecoded) {
    const commands = kibanaPipeCommandURLDecoded.split('|');
    for (const commandString of commands) {
      const [command, ...args] = commandString.match(/(?:[^\s"']+|["'][^"']*["'])+/g) || [];
      for (const arg of args) {
        if (catCommand && arg.includes(' ')) {
          throw badRequest(
            `Invalid argument: Space character is not allowed in ${command} command arguments for /_cat requests {${arg}}`
          ).output.payload;
        }
      }
      switch (command) {
        case 'sort':
          modifiedResponse = sort(modifiedResponse, args, catHeader);
          break;
        case 'sed':
          modifiedResponse = sed(modifiedResponse, args);
          break;
        default:
          break;
      }
    }
  }
  return modifiedResponse;
}
