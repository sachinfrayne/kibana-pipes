export function sed(input: string, args: string[]): string {
  return args.reduce((result, arg, i) => {
    if (arg === '-e' && i + 1 < args.length) {
      const match = args[i + 1].match(/s\/(.*?)\/(.*?)\/(g?)/);
      if (match) {
        const [_, pattern, replacement] = match;
        const regex = new RegExp(pattern, match[3] === 'g' ? 'g' : '');
        return result.replace(regex, replacement);
      }
    }
    return result;
  }, input);
}
