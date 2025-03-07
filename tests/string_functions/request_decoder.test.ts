import { parseKibanaRequest } from '../../server/string_functions/request_parser';

// _cat/tasks, no leading slash, no es query string, no pipes
test('parse _cat/tasks', () => {
  const parsedKibanaRequest = parseKibanaRequest('_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

// /_cat/tasks, no es query string, no pipes
test('parse /_cat/tasks', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

// /_cat/tasks, single query string, no pipes
test('parse /_cat/tasks?v', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v', '']);
});

// /_cat/tasks, no query string, single pipe
test('parse /_cat/tasks|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort']);
});

// /_cat/tasks, no query string, single pipe, spaces before and after the pipe
test('parse /_cat/tasks | sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks | sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort']);
});

// /_cat/tasks, multiple query string params, no pipes
test('parse /_cat/tasks?v&h=action,task_id', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', '']);
});

// /_cat/tasks, no string params, multiple pipes
test('parse /_cat/tasks|sort -r|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks|sort -r|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort -r|sort']);
});

// /_cat/tasks, multiple query string params, single pipe
test('parse /_cat/tasks?v&h=action,task_id|sort -r', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id|sort -r');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r']);
});

// /_cat/tasks, multiple query string params, (v after &), single pipe
test('parse /_cat/tasks?h=action,task_id&v|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?h=action,task_id&v|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'h=action,task_id&v', 'sort']);
});

// /_cat/tasks, multiple query string params, multiple pipes
test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id|sort -r|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort']);
});

// /_cat/tasks, multiple query string params, three pipes
test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort|sort', () => {
  const parsedKibanaRequest = parseKibanaRequest('/_cat/tasks?v&h=action,task_id|sort -r|sort|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort|sort']);
});
