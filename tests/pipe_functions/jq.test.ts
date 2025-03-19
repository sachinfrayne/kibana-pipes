import { jq } from '../../server/pipe_functions/jq';
import { test, expect } from '@jest/globals';

test('jq first object in JSON array _cat/indices?h=index,health,status&format=json', () => {
  const input = `[
  {
    "index": "index1",
    "health": "green",
    "status": "open"
  },
  {
    "index": "index2",
    "health": "green",
    "status": "open"
  }
]
`;

  expect(jq(input, ["'.[0]'"])).toEqual(`{
  "index": "index1",
  "health": "green",
  "status": "open"
}`);
});
