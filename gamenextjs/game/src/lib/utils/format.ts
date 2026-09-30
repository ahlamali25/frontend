export function formatPrice(price: number) {
  return new Intl.NumberFormat("ar-SY").format(price);
}