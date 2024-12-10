export interface NailDesign {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isPromotional: boolean;
  promotionalPrice?: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
} 