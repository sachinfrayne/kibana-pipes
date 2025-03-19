export function jq(input: string, args: string[]): string {
  const json = JSON.parse(input);
  for (let i = 0; i < args.length; i++) {
    const match = args[i].match(/\.\[.*?]/);
    if (match) {
      const arrayNum = match[0].match(/^\.\[(\d+)]/);
      if (arrayNum !== null) {
        let newVar = arrayNum[1];
        return JSON.stringify(json[newVar], null, 2);
      }
    }
  }
  return '{}';
}
