import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Authentication } from '../../../services/authentication';
import { Jwtres } from '../../../models/jwtres';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  fromCampaignId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: Authentication,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ?fromCampaign=ID (cuando viene del botón "Invertir en esta campaña")
    this.fromCampaignId = this.route.snapshot.queryParamMap.get('fromCampaign');

    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],   // tu backend usa "mail"
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.error = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const credentials = this.loginForm.value; // { mail, password }

    this.authService.login(credentials).subscribe({
      next: (res: Jwtres) => {
        this.loading = false;

        const token = res?.token ?? res?.accessToken;
        if (!token) {
          this.error = res?.message || 'Credenciales inválidas.';
          return;
        }

        // Si venía desde "Invertir en esta campaña" → regresar al detalle
        if (this.fromCampaignId) {
          this.router.navigate(['/campaign', this.fromCampaignId]);
        } else {
          // Si no, lo mandamos al home (o luego a un dashboard)
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
      }
    });
  }

  get mail() { return this.loginForm.get('mail'); }
  get password() { return this.loginForm.get('password'); }
}
