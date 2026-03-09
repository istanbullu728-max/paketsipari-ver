export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  whatsappNumber: string;
  minOrderAmount: number;
  businessHours: {
    open: string;
    close: string;
    isOpenNow: boolean;
    isManualClosed: boolean;
    days: {
      [key: string]: {
        open: string;
        close: string;
        isClosed: boolean;
      };
    };
  };
  categories: Category[];
  products: Product[];
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  orderIndex: number;
}

export interface ProductVariationOption {
  id: string;
  name: string;
  priceDelta: number; // e.g. +10 for large, 0 for small
}

export interface ProductVariation {
  id: string;
  name: string; // e.g., 'Porsiyon', 'Sos'
  isRequired: boolean;
  options: ProductVariationOption[];
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  variations: ProductVariation[];
  orderIndex: number;
}
