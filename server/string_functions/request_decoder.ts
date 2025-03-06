// TODO: Big clean up of this function is needed, the if statements are a mess
// TODO: Consider decodeURIComponent before any other processing

export function decode(url: string) {
  url = url.endsWith('=') ? url.slice(0, -1) : url;
  
  const [, kibanaRequest] = url.split('?request=');
  let elasticRequest = kibanaRequest;
  let paramsPlusPipes = '';
  let elasticQueryString = '';
  let kibanaPipeCommand = '';

  if (kibanaRequest.includes('%3F')) {
    [elasticRequest, paramsPlusPipes] = kibanaRequest.split('%3F');
  }

  if (!elasticRequest.startsWith('%2F')) {
    elasticRequest = '/' + elasticRequest;
  }

  if (!paramsPlusPipes.includes('%7C')) {
    elasticQueryString = paramsPlusPipes;
  }

  if (paramsPlusPipes.includes('%7C')) {
    const pipeParts = paramsPlusPipes.split('%7C');
    elasticQueryString = pipeParts.shift() || '';
    kibanaPipeCommand = pipeParts.join('|');
  }

  if (!kibanaRequest.includes('%3F') && kibanaRequest.includes('%7C')) {
    elasticRequest = kibanaRequest.split('%7C')[0];
    let [, ...kibanaPipeCommandParts] = kibanaRequest.split('%7C');
    kibanaPipeCommand = kibanaPipeCommandParts.join('|');
  }

  const elasticRequestURLDecoded = decodeURIComponent(elasticRequest);
  const elasticQueryStringURLDecoded = decodeURIComponent(elasticQueryString);
  const kibanaPipeCommandURLDecoded = decodeURIComponent(kibanaPipeCommand);

  return [elasticRequestURLDecoded, elasticQueryStringURLDecoded, kibanaPipeCommandURLDecoded];
}
