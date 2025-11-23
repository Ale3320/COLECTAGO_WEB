export interface BaseUser {
  _id: string;
  userName: string;
  mail: string;
  password: string;
  country: string;
  phone: number;
  role: 'administrador' | 'crowdfounder' | 'inversionista';
}

export interface AdminUser extends BaseUser {
  permissions: string[];
}

export interface CrowdfounderUser extends BaseUser {
  bio: string;
  organization: string;
  website: string;
  verified: boolean;
  rating: number;
  followers: number;
  campaigns: string[];  // IDs de campañas
}

export interface InvestorUser extends BaseUser {
  balance: {
    amount: number;
    currency: string;
  };
  investedAmount: {
    total: number;
    currency: string;
  };
  investmentCount: {
    total: number;
  };
  inversiones: {
    investmentId: string;
    investedAmount: number;
    date: string;
    status: string;
  }[];
  rating: number;
}

export type User = BaseUser | AdminUser | CrowdfounderUser | InvestorUser;