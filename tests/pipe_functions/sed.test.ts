import { sed } from '../../server/pipe_functions/sed';
import { test, expect } from '@jest/globals';

test('unrecognised sed argument should throw an error', () => {
  try {
    const input = `green  index1 13.7kb
`;
    sed(input, ['-e', "'s/green/good'"]);

  } catch (error) {
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Invalid argument: sed command cannot parse {'s/green/good'}"
    );
  }
});

test('sed _cat/indices to replace first green/yellow/red with good/ok/danger', () => {
  const input = `health index  store.size
green  index1a 13.7kb
green  index1b 13.7kb
yellow index3a 22.1kb
yellow index3b 22.1kb
red    index2a 11.4kb
red    index2b 11.4kb
`;

  const parsedKibanaRequest = sed(input, [
    '-e',
    "'s/green/good/'",
    '-e',
    "'s/yellow/ok/'",
    '-e',
    "'s/red/danger/'",
  ]);

  expect(parsedKibanaRequest).toEqual(`health index  store.size
good  index1a 13.7kb
green  index1b 13.7kb
ok index3a 22.1kb
yellow index3b 22.1kb
danger    index2a 11.4kb
red    index2b 11.4kb
`);
});

test('sed _cat/indices to replace first green/yellow/red with good/ok/danger', () => {
  const input = `health index  store.size
green  index1a 13.7kb
green  index1b 13.7kb
yellow index3a 22.1kb
yellow index3b 22.1kb
red    index2a 11.4kb
red    index2b 11.4kb
`;

  const parsedKibanaRequest = sed(input, [
    '-e',
    "'s/green/good/g'",
    '-e',
    "'s/yellow/ok/'",
    '-e',
    "'s/red/danger/g'",
  ]);

  expect(parsedKibanaRequest).toEqual(`health index  store.size
good  index1a 13.7kb
good  index1b 13.7kb
ok index3a 22.1kb
yellow index3b 22.1kb
danger    index2a 11.4kb
danger    index2b 11.4kb
`);
});
