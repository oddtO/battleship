export function RandomNum(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}