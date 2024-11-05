export interface ShopifyOrder {
  lineItems: {
    edges: Array<{
      node: {
        quantity: number;
        title: string;
        product?: {
          productType?: string;
          category?: {
            name: string;
          };
        };
      };
    }>;
  };
  totalPriceSet: {
    shopMoney: {
      amount: string;
    };
  };
}