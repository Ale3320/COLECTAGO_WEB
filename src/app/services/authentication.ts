import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { Jwtres } from '../models/jwtres';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  apiUri = '/api';
  authSubject = new BehaviorSubject(false);
  private token: string | null = '';

  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/signup', user);
  }

  login(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/login', user).pipe(
      tap((res: Jwtres) => {
          if (!res) {
            console.error('Respuesta vacía del servidor');
            return;
          }

          // Soporta tanto 'token' como 'accessToken'
          const token = res.token ?? res.accessToken ?? null;

          if (!token) {
            console.error('No se recibió token en la respuesta');
            return;
          }

          // Guardar token y usuario
          this.saveToken(token, String(res.expiresIn ?? ''));
          if (res.user) {
            localStorage.setItem('USER', JSON.stringify(res.user));
          }

          // Marcar como autenticado
          this.authSubject.next(true);
        })
      );
  }

  logout() {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.removeItem('USER');
    this.authSubject.next(false);
  }

  private saveToken(token: string, expiresIn: string) {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", token);
    this.token = token;
  }

  private getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  getUser(): User | null {
    const raw = localStorage.getItem('USER');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.role ?? null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
