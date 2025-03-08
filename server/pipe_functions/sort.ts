import { sort as fastSort } from 'fast-sort';

const sortOptions: { [key: string]: (line: string) => string } = {
  '-r': (line: string) => line,
  '-f': (line: string) => line.toLowerCase(),
};

const getSortFunction = (args: string[]) => {
  let sortFn = (line: string) => line;

  args.forEach((option) => {
    if (sortOptions[option]) {
      sortFn = sortOptions[option];
    }
  });

  return sortFn;
};

export function sort(input: string, args: string[] = [], catHeader: boolean): string {
  const lines = input.split('\n');
  let header = '';
  let body: string[];

  if (catHeader) {
    [header, ...body] = lines;
  } else {
    body = lines;
  }

  const sortFn = getSortFunction(args);
  const sortedBody = fastSort(body).by([
    { asc: (line) => (line === '' ? 1 : 0) },
    args.includes('-r') ? { desc: sortFn } : { asc: sortFn },
  ]);

  return catHeader ? [header, ...sortedBody].join('\n') : sortedBody.join('\n');
}
