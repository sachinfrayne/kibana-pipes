import * as requestParser from '../../server/string_functions/request_parser';
import { test, expect } from '@jest/globals';

test('this is a cat request', () => {
  expect(requestParser.isCatRequest('/_cat/indices?v')).toEqual(true);
});

test('this is not a cat request', () => {
  expect(requestParser.isCatRequest('/test/_search')).toEqual(false);
});

test('this has a cat header ?v', () => {
  expect(requestParser.hasCatHeader('v')).toEqual(true);
});

test('this has a cat header &v', () => {
  expect(requestParser.hasCatHeader('h=index&v')).toEqual(true);
});

test('this does has a cat header', () => {
  expect(requestParser.hasCatHeader('h=index')).toEqual(false);
});

test('this has a json format ?format=json', () => {
  expect(requestParser.getFormat('h=index&format=json&s=index')).toEqual('json');
});

test('this has a json format ?format=text', () => {
  expect(requestParser.getFormat('h=index&format=text')).toEqual('text');
});

test('this has a json format ?format=yaml', () => {
  expect(requestParser.getFormat('h=index&format=yaml')).toEqual('yaml');
});

test('parse _cat/tasks', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

test('parse _cat/tasks', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

test('parse /_cat/tasks', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', '']);
});

test('parse /_cat/tasks?v', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks?v');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v', '']);
});

test('parse /_cat/tasks|sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort']);
});

test('parse /_cat/tasks|sort with pipe sort on a new line', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(`/_cat/tasks
 | sort -r`);
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort -r']);
});

test('parse with spaces /_cat/tasks | sort | sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks | sort | sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks?v&h=action,task_id');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', '']);
});

test('parse /_cat/tasks|sort -r|sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest('/_cat/tasks|sort -r|sort');
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', '', 'sort -r|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(
    '/_cat/tasks?v&h=action,task_id|sort -r'
  );
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r']);
});

test('parse /_cat/tasks?h=action,task_id&v|sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(
    '/_cat/tasks?h=action,task_id&v|sort'
  );
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'h=action,task_id&v', 'sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(
    '/_cat/tasks?v&h=action,task_id|sort -r|sort'
  );
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sort -r|sort|sort', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(
    '/_cat/tasks?v&h=action,task_id|sort -r|sort|sort'
  );
  expect(parsedKibanaRequest).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort|sort']);
});

test('parse /_cat/tasks?v&h=action,task_id|sed -e "s/STRING/SUBTITUTION STRING/" even though this is a cat command and will ultimately throw an error', () => {
  const parsedKibanaRequest = requestParser.parseKibanaRequest(
    '/_cat/tasks?v&h=action,task_id|sed -e "s/STRING/SUBTITUTION STRING/"'
  );
  expect(parsedKibanaRequest).toEqual([
    '/_cat/tasks',
    'v&h=action,task_id',
    'sed -e "s/STRING/SUBTITUTION STRING/"',
  ]);
});
