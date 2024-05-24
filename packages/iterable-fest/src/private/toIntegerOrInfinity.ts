export default function toIntegerOrInfinity(value: number): number {
  if (value === Infinity || value === -Infinity) {
    return value;
  }

  return ~~value;
}
