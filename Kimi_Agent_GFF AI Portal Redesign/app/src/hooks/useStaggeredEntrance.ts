export function useStaggeredEntrance(
  count: number,
  baseDelay: number = 0,
  staggerMs: number = 50
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * staggerMs);
}
