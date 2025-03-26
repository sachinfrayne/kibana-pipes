import { sort } from './sort';
import { sed } from './sed';
import { jq } from './jq';
import { badRequest } from '@hapi/boom';
import shellQuote from 'shell-quote';

const acceptedCommands = ['sed', 'jq', 'sort'];

export function splitKibanaPipeCommands(kibanaPipeCommand: string): string[][] {
  const parsedCommand = shellQuote
    .parse(kibanaPipeCommand)
    .filter((item): item is string => typeof item === 'string');

  return parsedCommand.reduce<string[][]>(
    (result, item) => {
      if (acceptedCommands.includes(item)) {
        result.push([item]);
      } else {
        result[result.length - 1].push(item);
      }
      return result;
    },
    acceptedCommands.includes(parsedCommand[0]) ? [] : [[]]
  );
}

export function processKibanaPipes(
  kibanaPipeCommand: string,
  input: string,
  catHeader: boolean,
  catCommand: boolean
) {
  if (kibanaPipeCommand) {
    const commands = splitKibanaPipeCommands(kibanaPipeCommand);
    for (const commandString of commands) {
      const [command, ...args] = commandString;

      if (!catCommand && command == 'sort') {
        throw badRequest('Invalid command: sort command is only allowed for /_cat requests').output
          .payload;
      }

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
          input = jq(input, args[0]);
          break;
        default:
          break;
      }
    }
  }
  return input;
}
