export function sortLines(input: string, args: array, catHeader: boolean): string {
  const lines = input.split('\n');
  const header = catHeader ? lines.shift() : null;
  const sortedLines = lines.filter((line) => line).sort((a, b) => a.localeCompare(b));
  if (args.includes('-r')) {
    sortedLines.reverse();
  }
  if (header) sortedLines.unshift(header);
  sortedLines.push('');
  return sortedLines.join('\n');
}
