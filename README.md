# kibanaPipes

Pipe Elasticsearch commands, especially `_cat` requests through bash style pipes in dev tools console

---

## Example

```
GET kbn:/api/kp?request=/_cat/indices?v|sort

POST kbn:/api/kp
{
  "request": "/_cat/indices?v|sort"
}
```

## Supported Commands and Arguments

<dl>
  <dt><code>sort</code></dt>
  <dd><code>-r</code> Reverse sort</dd>
  <dd><code>-f</code> Ignore case</dd>

  <dt><code>sed</code></dt>
  <dd><code>-e</code> Substitution <code>'s/STRING/SUBSTITUTION/'</code> & Global substitution <code>'s/STRING/SUBSTITUTION/g'</code></dd>
</dl>

## Scripts

<dl>
  <dt><code>yarn test</code></dt>
  <dd>Execute this to install run all the unit tests</dd>

  <dt><code>yarn build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>

## Limitations

- The `+` character will be converted to a space character in all circumstances, therefore;
  - It cannot be used in sed arguments, e.g. `sed -e 's/STRING/SUBSTITUTION+STRING/g'` will be interpreted as `sed -e 's/STRING/SUBSTITUTION STRING/g'`
