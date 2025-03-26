import {
  splitKibanaPipeCommands,
  processKibanaPipes,
} from '../../server/pipe_functions/pipe_function_runner';
import { test, expect } from '@jest/globals';

test('split kibana pipe command with no pipes (sort -r -f)', () => {
  const processedKibanaPipes = splitKibanaPipeCommands('sort -r -f');
  expect(processedKibanaPipes).toEqual([['sort', '-r', '-f']]);
});

test("split kibana pipe command with pipes (sort -r -f | sed -e 's/STRING/SUBSTITUTION/g')", () => {
  const processedKibanaPipes = splitKibanaPipeCommands(
    "sort -r -f | sed -e 's/STRING/SUBSTITUTION/g'"
  );
  expect(processedKibanaPipes).toEqual([
    ['sort', '-r', '-f'],
    ['sed', '-e', 's/STRING/SUBSTITUTION/g'],
  ]);
});

test("split kibana pipe command with pipes (sort -r -f | jq '.[0] | {index: .index}'", () => {
  const processedKibanaPipes = splitKibanaPipeCommands("sort -r -f | jq '.[0] | {index: .index}'");
  expect(processedKibanaPipes).toEqual([
    ['sort', '-r', '-f'],
    ['jq', '.[0] | {index: .index}'],
  ]);
});

test('single pipe reverse sort ignoring casing split via processKibanaPipes', () => {
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

test('reverse sort and then sed index to i via processKibanaPipes', () => {
  const processedKibanaPipes = processKibanaPipes(
    "sort -r | sed -e 's/index/i/g'",
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
      'Invalid argument: Space character is not allowed in sed command arguments for /_cat requests {s/STRING/SUBSTITUTION STRING/}'
    );
  }
});

test('sort on anything but a cat command should throw an error', () => {
  try {
    processKibanaPipes(
      'sort -r',
      `{
         "index": "index1"
       }
  `,
      false,
      false
    );
  } catch (error) {
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      'Invalid command: sort command is only allowed for /_cat requests'
    );
  }
});

test('sed then jq with a pipe in the arg must parse through correctly via processKibanaPipes', () => {
  const processedKibanaPipes = processKibanaPipes(
    "sed -e 's/index/awesomeindex/' | jq '.[0] | {index: .awesomeindex}'",
    `[
  {
    "health": "green",
    "index": "index1"
  },
  {
    "health": "green",
    "index": "index2"
  }
]
`,
    false,
    true
  );

  expect(processedKibanaPipes).toEqual(`{
  "index": "index1"
}
`);
});
