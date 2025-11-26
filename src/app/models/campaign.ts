// src/app/models/campaign.ts

export interface ArticlesOfIncorporation {
  data?: {
    type: string; 
    data: number[];
  } | null;

  contentType: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export interface Campaign {
  _id?: string;
  owner: string;
  campaignName: string;
  NIT: string;
  articlesOfIncorporation: ArticlesOfIncorporation;
  campaignObjectives: string;
  serviceOrProduct: string;
  collected: number;
  activeOrInactive: 'activo' | 'inactivo' | string;

  createdAt?: string;
  updatedAt?: string;
}
