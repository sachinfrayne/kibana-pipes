export function parseKibanaRequest(kibanaRequest: string): [string, string, string] {
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

  return [elasticRequest, elasticQueryString, kibanaPipeCommand];
}
