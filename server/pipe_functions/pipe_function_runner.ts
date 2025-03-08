import { sort } from './sort';
import { sed } from './sed';

export function processKibanaPipes(
  kibanaPipeCommandURLDecoded: string,
  modifiedResponse: string,
  catHeader: boolean
) {
  if (kibanaPipeCommandURLDecoded) {
    const commands = kibanaPipeCommandURLDecoded.split('|');
    for (const commandString of commands) {
      const [command, ...args] = commandString.trim().split(' ');
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
