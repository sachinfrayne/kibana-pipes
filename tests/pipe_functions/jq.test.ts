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

  expect(jq(input, "'.[0]'")).toEqual(`{
  "index": "index1",
  "health": "green",
  "status": "open"
}
`);
});

test('jq index from first object in JSON array _cat/indices?h=index,health,status&format=json', () => {
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

  expect(jq(input, "'.[0] | {index: .index}'")).toEqual(`{
  "index": "index1"
}
`);
});

test('jq index and health from first object in JSON array _cat/indices?h=index,health,status&format=json', () => {
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

  expect(jq(input, "'.[0] | {index: .index, health: .health}'")).toEqual(`{
  "index": "index1",
  "health": "green"
}
`);
});
