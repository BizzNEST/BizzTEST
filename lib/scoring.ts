/**
 * Calculate partial credit score for multi-select questions using the "correct minus incorrect" strategy
 * @param selected Array of selected option indices as strings
 * @param correct Array of correct option indices as strings  
 * @param totalOptions Total number of options available
 * @param maxPoints Maximum points for this question
 * @returns Partial score between 0 and maxPoints
 */
export function multiSelectScore(selected: string[], correct: string[], totalOptions: number, maxPoints: number): number {
  const setSel = new Set(selected);
  const setCor = new Set(correct);
  const TP = [...setSel].filter(x => setCor.has(x)).length;
  const FP = [...setSel].filter(x => !setCor.has(x)).length;
  const k = setCor.size;
  const m = totalOptions;
  let s = (TP / k) - (FP / (m - k));
  s = Math.max(0, Math.min(1, s));
  return Math.round(s * maxPoints * 100) / 100;
}
