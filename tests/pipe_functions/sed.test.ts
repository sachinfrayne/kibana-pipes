import { sed } from '../../server/pipe_functions/sed';

test('sed _cat/indices to replace green/yellow/red with good/ok/danger', () => {
  const input = `health index  store.size
green  index1 13.7kb
yellow index3 22.1kb
red    index2 11.4kb
`;

  const parsedKibanaRequest = sed(input, [
    "-e",
    "'s/green/good/'",
    "-e",
    "'s/yellow/ok/'",
    "-e",
    "'s/red/danger/'",
  ]);

  expect(parsedKibanaRequest).toEqual(`health index  store.size
good  index1 13.7kb
ok index3 22.1kb
danger    index2 11.4kb
`);
});
