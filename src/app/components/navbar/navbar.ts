//Este componente permite importarse directametne en otors componentes 

import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,//El componente funciona solo
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  isLoggedIn = false;
  role: string | null = null;
  userName: string | null = null;

  constructor(
    private authService: Authentication,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthState();

    // por si en algún momento usas authSubject en el servicio
    this.authService.authSubject.subscribe(() => {
      this.loadAuthState();
    });
  }

  loadAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user: User | null = this.authService.getUser();
    this.role = user?.role ?? null;
    this.userName = user?.userName ?? null;
  }

  onLogout(): void {
    this.authService.logout();
    this.loadAuthState();
    this.router.navigate(['/']); // volver al inicio
  }
}
