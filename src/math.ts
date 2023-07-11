export function vectorLength(vector: number[]) {
  return Math.sqrt(vector.reduce((sum, num) => sum + num ** 2, 0));
}
export function pointDistance(startPoint: number[], endPoint: number[]) {
  return Math.sqrt(
    endPoint
      .map((end, i) => end - startPoint[i])
      .reduce((sum, num) => sum + num ** 2, 0),
  );
}
