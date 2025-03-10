import { parseKibanaRequest } from '../../server/string_functions/request_parser';

test('parse _cat/tasks', () => {
  const parsedKibanaRequest = parseKibanaRequest('_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

test('parse /_cat/tasks', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

test('parse /_cat/tasks?v', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v', '']);
});

test('parse /_cat/tasks|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort']);
});

test('parse /_cat/tasks|sort with pipe sort on a new line', () => {
  const parsedKibanaRequest = parseKibanaRequest(`/_cat/tasks
 | sort -r`);
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort -r']);
});

test('parse with spaces /_cat/tasks | sort | sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks | sort | sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', '']);
});

test('parse /_cat/tasks|sort -r|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks|sort -r|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort -r|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id|sort -r');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r']);
});

test('parse /_cat/tasks?h=action,task_id&v|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?h=action,task_id&v|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'h=action,task_id&v', 'sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id|sort -r|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest(
    '/_cat/tasks?v&h=action,task_id|sort -r|sort|sort'
  );
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort|sort']);
});
