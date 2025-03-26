export function jq(input: string, arg: string): string {
  const json = JSON.parse(input);

  const [arrayAccess, operation] = arg
    .replace(/'/g, '')
    .split('|')
    .map((part) => part.trim());

  const arrayMatch = arrayAccess.match(/\.\[(\d+)]/);
  const intermediateResult = arrayMatch ? json[parseInt(arrayMatch[1], 10)] : json;

  const finalResult =
    operation && operation.startsWith('{') && operation.endsWith('}')
      ? operation
          .slice(1, -1)
          .split(',')
          .reduce((acc, field) => {
            const [key, value] = field.split(':').map((part) => part.trim());
            acc[key] = intermediateResult[value.slice(1)];
            return acc;
          }, {} as Record<string, unknown>)
      : intermediateResult;

  return JSON.stringify(finalResult, null, 2) + '\n';
}
