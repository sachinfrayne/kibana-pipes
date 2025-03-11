import { processKibanaPipes } from '../../server/pipe_functions/pipe_function_runner';

test('reverse sort ignoring casing split via processKibanaPipes', () => {
  const processedKibanaPipes = processKibanaPipes(
    'sort -r -f',
    `PbPgpFDVQ6WTRSfi6cMHDQ index1
pwFuf4UtQp6EXi4_6Jt92w index2
`,
    false,
    true
  );

  expect(processedKibanaPipes).toEqual(`pwFuf4UtQp6EXi4_6Jt92w index2
PbPgpFDVQ6WTRSfi6cMHDQ index1
`);
});

test('sed to change index to i via processKibanaPipes', () => {
  const processedKibanaPipes = processKibanaPipes(
    "sed -e 's/index/i/g'",
    `PbPgpFDVQ6WTRSfi6cMHDQ index1
pwFuf4UtQp6EXi4_6Jt92w index2
`,
    false,
    true
  );

  expect(processedKibanaPipes).toEqual(`PbPgpFDVQ6WTRSfi6cMHDQ i1
pwFuf4UtQp6EXi4_6Jt92w i2
`);
});

test('reverse sort and then sed index to i via processKibanaPipes', () => {
  const processedKibanaPipes = processKibanaPipes(
    "sort -r|sed -e 's/index/i/g'",
    `PbPgpFDVQ6WTRSfi6cMHDQ index1
pwFuf4UtQp6EXi4_6Jt92w index2
`,
    false,
    true
  );

  expect(processedKibanaPipes).toEqual(`pwFuf4UtQp6EXi4_6Jt92w i2
PbPgpFDVQ6WTRSfi6cMHDQ i1
`);
});

test('sed with a space in the arg sed -e "s/STRING/SUBSTITUTION STRING/" should throw error', () => {
  try {
    processKibanaPipes(
      "sed -e 's/STRING/SUBSTITUTION STRING/'",
      `PbPgpFDVQ6WTRSfi6cMHDQ index1
  pwFuf4UtQp6EXi4_6Jt92w index2
  `,
      false,
      true
    );
  } catch (error) {
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Invalid argument: Space character is not allowed in sed command arguments for /_cat requests {'s/STRING/SUBSTITUTION STRING/'}"
    );
  }
});
