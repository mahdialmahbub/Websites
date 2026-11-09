export default function toCardData(product) {
  if (!product) return {};

  const original = product.startingPrice;
  const hasDiscount = product.discountPercentage > 0;
  const discounted = hasDiscount
    ? Math.round(original * (1 - product.discountPercentage / 100) * 100) / 100
    : original;

  return {
    id: product._id,
    image: product.images?.[0]?.url || "/placeholder.png",
    badge: product.badges?.[0]?.name, // backend populates badges with { _id, name }
    title: product.title,
    rating: product.rating?.average ?? 0,
    reviewCount: product.rating?.count ?? 0,
    price: discounted,
    originalPrice: hasDiscount ? original : undefined, // shows the strikethrough price only if there's a real discount
    status: product.stock <= 0 ? "out of stock" : undefined,
  };
}
