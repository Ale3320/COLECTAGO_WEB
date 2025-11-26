import { User } from './user';

export interface Jwtres {
  ok: boolean;
  message: string;

  // Opcionales: solo en respuestas de login o cuando haga falta
  token?: string;
  user?: User;
  expiresIn?: number;
}
