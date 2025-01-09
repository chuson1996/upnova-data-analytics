import { ShopifyOrder } from '@/types/shopify';

const isNotShippingProtection = (item: ShopifyOrder['lineItems']['edges'][0]) => {
  const product = item.node.product;
  if (!product) return true;
  
  const productType = (product.productType || '').toLowerCase();
  const productTitle = item.node.title.toLowerCase();
  
  return !['shipping', 'protection', 'insurance'].some(term => 
    productType.includes(term) || productTitle.includes(term)
  );
};

export const processOrderSizes = (orders: ShopifyOrder[]) => {
  const sizes = orders.map(order => 
    order.lineItems.edges
      .filter(isNotShippingProtection)
      .reduce((sum, item) => sum + item.node.quantity, 0)
  );

  const sizeMap = new Map<number, number>();
  sizes.forEach(size => {
    sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
  });

  return Array.from(sizeMap.entries())
    .map(([size, count]) => ({
      name: `${size} ${size === 1 ? 'item' : 'items'}`,
      value: count
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
};

export const processPriceRanges = (orders: ShopifyOrder[], range = 30) => {
  const prices = orders.map(order => 
    parseFloat(order.totalPriceSet.shopMoney.amount)
  ).sort((a, b) => a - b);

  const percentile90 = prices[Math.floor(prices.length * 0.9)];
  const maxPrice = Math.ceil(percentile90 / range) * range;
  const minPrice = Math.floor(Math.min(...prices) / range) * range;
  
  const ranges: { min: number; max: number }[] = [];
  for (let i = minPrice; i < maxPrice; i += range) {
    ranges.push({ min: i, max: i + range });
  }
  ranges.push({ min: maxPrice, max: Infinity });

  const rangeCounts = ranges.map(range => ({
    name: range.max === Infinity ? `$${range.min}+` : `$${range.min}-$${range.max}`,
    value: prices.filter(price => price >= range.min && price < range.max).length
  }));

  return rangeCounts;
};

export const processProductCategories = (orders: ShopifyOrder[]) => {
  const categories = new Map<string, number>();

  orders.forEach(order => {
    order.lineItems.edges
      .filter(isNotShippingProtection)
      .forEach(item => {
        const category = item.node.product?.category?.name || 'Unknown';
        categories.set(category, (categories.get(category) || 0) + item.node.quantity);
      });
  });

  return Array.from(categories.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const processProductTypes = (orders: ShopifyOrder[]) => {
  const types = new Map<string, number>();

  orders.forEach(order => {
    order.lineItems.edges
      .filter(isNotShippingProtection)
      .forEach(item => {
        const type = item.node.product?.productType || 'Undefined';
        types.set(type, (types.get(type) || 0) + item.node.quantity);
      });
  });

  return Array.from(types.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};