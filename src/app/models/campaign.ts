// src/app/models/campaign.ts

export interface ArticlesOfIncorporation {
  // OJO: depende de cómo tu API devuelva el Buffer.
  // Si lo manda como objeto { type: 'Buffer', data: number[] }, podríamos tiparlo así:
  data?: {
    type: string;          // normalmente 'Buffer'
    data: number[];        // contenido binario
  } | null;

  contentType: string;      // ej: 'application/pdf'
  filename: string;
  size: number;
  uploadedAt: string;       // viene como string ISO; se puede convertir a Date si quieres
}

export interface Campaign {
  _id?: string;             // id de Mongo que te llega en las respuestas
  owner: string;            // ObjectId del usuario (puede ser string y ya)
  campaignName: string;
  NIT: string;
  articlesOfIncorporation: ArticlesOfIncorporation;
  campaignObjectives: string;
  serviceOrProduct: string;
  collected: number;
  activeOrInactive: 'activo' | 'inactivo' | string;

  createdAt?: string;       // por timestamps: true
  updatedAt?: string;
}
