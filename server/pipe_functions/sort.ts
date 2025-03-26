import { badRequest } from '@hapi/boom';

const acceptedArgs = ['-r', '-f'];

function handleBadSortCommand(args: string[]) {
  for (const arg of args) {
    if (!acceptedArgs.includes(arg)) {
      throw badRequest(`Invalid argument: sort command has no argument {${arg}}`).output.payload;
    }
  }
}

export function sort(input: string, args: string[], catHeader: boolean): string {
  if (args.length > 0) {
    handleBadSortCommand(args);
  }
  const hasTrailingNewline = input.endsWith('\n');
  const reverseOrder = args.includes('-r');
  const ignoreCase = args.includes('-f');

  const lines = input.split('\n');
  const header = catHeader ? lines.shift() : null;

  const sortedLines = lines
    .filter((line) => line.trim() !== '')
    .sort((a, b) => {
      const aValue = ignoreCase ? a.toLowerCase() : a;
      const bValue = ignoreCase ? b.toLowerCase() : b;
      return reverseOrder ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
    })
    .join('\n');

  return hasTrailingNewline
    ? (header ? header + '\n' : '') + sortedLines + '\n'
    : (header ? header + '\n' : '') + sortedLines;
}
