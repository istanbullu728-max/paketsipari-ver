export interface ServiceArea {
  id: string;
  city: string;
  district: string;
  neighborhoods: string[];
}

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
  serviceAreas: ServiceArea[];
  address?: string;
  description?: string;
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
  price: number; // base price addition
  orderIndex: number;
}

export interface ProductVariation {
  id: string;
  name: string; // Group title (e.g. "İçecek Seçimi")
  type: "single" | "multiple";
  min?: number;
  max?: number;
  options: ProductVariationOption[];
  orderIndex: number;
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
