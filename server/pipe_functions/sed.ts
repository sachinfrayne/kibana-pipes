export function sed(input: string, args: string[]): string {
  let result = input;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-e' && i + 1 < args.length) {
      const match = args[i + 1].match(/s\/(.*?)\/(.*?)\/'/);
      if (match) {
        const [_, pattern, replacement] = match;
        const regex = new RegExp(pattern, 'g');
        result = result.replace(regex, replacement);
      }
      i++;
    }
  }
  return result;
}
