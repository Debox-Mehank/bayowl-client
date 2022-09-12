export default function NumToPrice(num: number) {
  return `₹ ${num.toLocaleString("en-IN")}`;
}
