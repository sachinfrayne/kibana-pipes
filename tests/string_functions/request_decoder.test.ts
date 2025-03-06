import { decode } from '../../server/string_functions/request_decoder';

// _cat/tasks, no leading slash, no es query string, no pipes
test('decode kbn:/api/kp?request=_cat/tasks', () => {
  const decoded = decode('kbn:/api/kp?request=_cat%2Ftasks');
  expect(decoded).toEqual(['/_cat/tasks', '', '']);
});

// /_cat/tasks, no es query string, no pipes
test('decode kbn:/api/kp?request=/_cat/tasks', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks');
  expect(decoded).toEqual(['/_cat/tasks', '', '']);
});

// /_cat/tasks, single query string, no pipes
test('decode kbn:/api/kp?request=/_cat/tasks?v', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%3Fv');
  expect(decoded).toEqual(['/_cat/tasks', 'v', '']);
});

// /_cat/tasks, no query string, single pipe
test('decode kbn:/api/kp?request=/_cat/tasks|sort', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%7Csort');
  expect(decoded).toEqual(['/_cat/tasks', '', 'sort']);
});

// /_cat/tasks, multiple query string params, no pipes
test('decode kbn:/api/kp?request=/_cat/tasks?v&h=action,task_id', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%3Fv&h=action,task_id');
  expect(decoded).toEqual(['/_cat/tasks', 'v&h=action,task_id', '']);
});

// /_cat/tasks, no string params, multiple pipes
test('decode kbn:/api/kp?request=/_cat/tasks|sort -r|sort', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%7Csort%20-r%7Csort');
  expect(decoded).toEqual(['/_cat/tasks', '', 'sort -r|sort']);
});

// /_cat/tasks, multiple query string params, single pipe
test('decode kbn:/api/kp?request=/_cat/tasks?v&h=action,task_id|sort -r', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%3Fv&h=action,task_id%7Csort%20-r');
  expect(decoded).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r']);
});

// /_cat/tasks, multiple query string params, (v after &), single pipe
test('decode kbn:/api/kp?request=/_cat/tasks?h=action,task_id&v|sort', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%3Fh%3Daction%2Ctask_id&v%7Csort=');
  expect(decoded).toEqual(['/_cat/tasks', 'h=action,task_id&v', 'sort']);
});

// /_cat/tasks, multiple query string params, multiple pipes
test('decode kbn:/api/kp?request=/_cat/tasks?v&h=action,task_id|sort -r|sort', () => {
  const decoded = decode('kbn:/api/kp?request=%2F_cat%2Ftasks%3Fv&h=action,task_id%7Csort%20-r%7Csort');
  expect(decoded).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort']);
});

// /_cat/tasks, multiple query string params, three pipes
test('decode kbn:/api/kp?request=/_cat/tasks?v&h=action,task_id|sort -r|sort|sort', () => {
  const decoded = decode(
    'kbn:/api/kp?request=%2F_cat%2Ftasks%3Fv&h=action,task_id%7Csort%20-r%7Csort%7Csort'
  );
  expect(decoded).toEqual(['/_cat/tasks', 'v&h=action,task_id', 'sort -r|sort|sort']);
});
