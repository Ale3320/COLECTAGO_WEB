import { User } from './user';

export interface Jwtres {
  ok: boolean;
  token: string;
  accessToken: string;
  user: User;
  message: string;
  expiresIn: number;
}