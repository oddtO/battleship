export function RandomNum(min, max) {
  const excludingMax = max - 1;
  return Math.round(Math.random() * (excludingMax - min) + min);
}
