export interface Investment {
  _id: string;
  campaign: string;     // ObjectId como string
  investor: string;     // ObjectId como string
  amount: number;
  status: "iniciado" | "pagoPendiente" | "confirmado" | "fallido" | "reembolsado";
  createdAt: string;
  updatedAt: string;
}
