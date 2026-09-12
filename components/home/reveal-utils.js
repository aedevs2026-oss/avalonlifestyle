export function staggerDelay(index, step = 90, base = 0) {
  return base + index * step;
}
