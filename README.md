# kibana_pipes

Pipe Elasticsearch commands, especially `_cat` requests through bash style pipes in dev tools console

---

## Example

```http
GET kbn:/api/kp?request=/_cat/indices?v|sort

POST kbn:/api/kp
{
  "request": "/_cat/indices?v|sort"
}
```

## Supported Commands

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

