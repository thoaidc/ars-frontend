export interface Cart {
  id?: number;
  userId: number;
  quantity: number;
  products: CartProduct[];
}

export interface CartProduct {
  id?: number;
  shopId: number;
  productId: number;
  productName: string;
  thumbnail: string;
  price: string;
  data?: string;
}

export interface CartProductOption {
  id: number;
  selectedOptionValueId: number;
  selectedOptionValueImage: string;
}
