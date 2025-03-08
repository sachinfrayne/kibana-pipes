// TODO: Big clean up of this function is needed, the if statements are a mess

export function parseKibanaRequest(kibanaRequest: string): [string, string, string] {
  // Trim spaces around the pipe character
  kibanaRequest = kibanaRequest
    .split('|')
    .map((part) => part.trim())
    .join('|');

  let elasticRequest = kibanaRequest;
  let paramsPlusPipes = '';
  let elasticQueryString = '';
  let kibanaPipeCommand = '';

  if (kibanaRequest.includes('?')) {
    [elasticRequest, paramsPlusPipes] = kibanaRequest.split('?');
  }

  if (!elasticRequest.startsWith('/')) {
    elasticRequest = '/' + elasticRequest;
  }

  if (!paramsPlusPipes.includes('|')) {
    elasticQueryString = paramsPlusPipes;
  }

  if (paramsPlusPipes.includes('|')) {
    const pipeParts = paramsPlusPipes.split('|');
    elasticQueryString = pipeParts.shift() || '';
    kibanaPipeCommand = pipeParts.join('|');
  }

  if (!kibanaRequest.includes('?') && kibanaRequest.includes('|')) {
    elasticRequest = kibanaRequest.split('|')[0];
    let [, ...kibanaPipeCommandParts] = kibanaRequest.split('|');
    kibanaPipeCommand = kibanaPipeCommandParts.join('|');
  }

  const elasticRequestURLDecoded = decodeURIComponent(elasticRequest);
  const elasticQueryStringURLDecoded = decodeURIComponent(elasticQueryString);
  const kibanaPipeCommandURLDecoded = decodeURIComponent(kibanaPipeCommand);

  return [elasticRequestURLDecoded, elasticQueryStringURLDecoded, kibanaPipeCommandURLDecoded];
}
