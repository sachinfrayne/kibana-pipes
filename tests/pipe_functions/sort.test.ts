import { sort } from '../../server/pipe_functions/sort';

test('sort _cat/indices without header', () => {
  const input = `green  index1 13.7kb
yellow index3 22.1kb
red    index2 11.4kb
`;

  expect(sort(input, [''], false)).toEqual(`green  index1 13.7kb
red    index2 11.4kb
yellow index3 22.1kb
`);
});

test('reverse sort _cat/indices without header', () => {
  const input = `green  index1 13.7kb
yellow index3 22.1kb
red    index2 11.4kb
`;

  expect(sort(input, ['-r'], false)).toEqual(`yellow index3 22.1kb
red    index2 11.4kb
green  index1 13.7kb
`);
});

test('sort _cat/indices with header', () => {
  const input = `health index  store.size
green  index1 13.7kb
yellow index3 22.1kb
red    index2 11.4kb
`;

  expect(sort(input, [''], true)).toEqual(`health index  store.size
green  index1 13.7kb
red    index2 11.4kb
yellow index3 22.1kb
`);
});

test('reverse sort _cat/indices with header', () => {
  const input = `health index  store.size
green  index1 13.7kb
yellow index3 22.1kb
red    index2 11.4kb
`;

  expect(sort(input, ['-r'], true)).toEqual(`health index  store.size
yellow index3 22.1kb
red    index2 11.4kb
green  index1 13.7kb
`);
});

test('sort _cat/indices ignore case', () => {
  const input = `uuid                   index
pbPgpFDVQ6WTRSfi6cMHDQ index1
PwFuf4UtQp6EXi4_6Jt92w index2
`;

  expect(sort(input, ['-f'], true)).toEqual(`uuid                   index
pbPgpFDVQ6WTRSfi6cMHDQ index1
PwFuf4UtQp6EXi4_6Jt92w index2
`);
});

test('reverse sort _cat/indices ignore case', () => {
  const input = `uuid                   index
pbPgpFDVQ6WTRSfi6cMHDQ index1
PwFuf4UtQp6EXi4_6Jt92w index2
`;

  expect(sort(input, ['-r', '-f'], true)).toEqual(`uuid                   index
PwFuf4UtQp6EXi4_6Jt92w index2
pbPgpFDVQ6WTRSfi6cMHDQ index1
`);
});
