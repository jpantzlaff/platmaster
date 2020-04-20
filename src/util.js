export function characterCount(string, character) {
  let count = 0;
  for (let char of string) {
    if (char === character) count++;
  }
  return count;
};

export function degToDms(degrees) {
  let remainder = degrees;
  const deg = Math.floor(degrees);
  remainder -= deg;
  const min = Math.floor(remainder * 60);
  remainder -= (min / 60);
  const sec = Math.round(remainder * 3600);
  return [deg, min, sec];
};

export function degToRad(deg) {
  return deg * (Math.PI / 180);
};

export function dmsToDeg(dms) {
  const [deg, min, sec] = dms;
  if (!(deg >= 0 && deg < 360)) {
    throw Error('Degrees outside range 0-360');
  }
  if (!(min >= 0 && min < 60)) {
    throw Error('Minutes outside range 0-60');
  }
  if (!(sec >= 0 && sec < 60)) {
    throw Error('Seconds outside range 0-60');
  }
  return deg + (min / 60) + (sec / 3600);
};

export function directionToAngle(direction) {
  let n = direction;
  n = 90 - n;
  if (n < 0) n += 360;
  return(degToRad(n));
};

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

export function radToDeg(rad) {
  return 180 * (rad / Math.PI);
};