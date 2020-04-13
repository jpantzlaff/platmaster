export async function getJson(url, params) {
  const target = new URL(url);
  Object.entries(params).forEach((p) => target.searchParams.append(...p));
  let response;
  try {
    response = await fetch(target.href).then((r) => r.text());
  } catch {
    throw Error('No network connection.');
  }
  try {
    return JSON.parse(response);
  } catch {
    throw Error(`Request to ${url} did not return JSON. Response:\n${response}`);
  }
};