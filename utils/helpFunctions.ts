export function fromWeiWithDecimals(amount: number, decimals: number) {
  return amount / Math.pow(10, decimals);
}

export function toWeiWithDecimals(amount: number, decimals: number) {
  return amount * Math.pow(10, decimals);
}
