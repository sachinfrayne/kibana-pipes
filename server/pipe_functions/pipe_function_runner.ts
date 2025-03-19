import { sort } from './sort';
import { sed } from './sed';
import { jq } from './jq';
import { badRequest } from '@hapi/boom';
import shellQuote from 'shell-quote';

export function processKibanaPipes(
  kibanaPipeCommand: string,
  input: string,
  catHeader: boolean,
  catCommand: boolean
) {
  if (kibanaPipeCommand) {
    const commands = kibanaPipeCommand.split('|');
    for (const commandString of commands) {
      const parsedCommand = shellQuote
        .parse(commandString)
        .filter((item): item is string => typeof item === 'string');
      const [command, ...args] = parsedCommand;

      for (const arg of args) {
        if (catCommand && command == 'sed' && arg.includes(' ')) {
          throw badRequest(
            `Invalid argument: Space character is not allowed in ${command} command arguments for /_cat requests {${arg}}`
          ).output.payload;
        }
      }
      switch (command) {
        case 'sort':
          input = sort(input, args, catHeader);
          break;
        case 'sed':
          input = sed(input, args);
          break;
        case 'jq':
          input = jq(input, args);
          break;
        default:
          break;
      }
    }
  }
  return input;
}
