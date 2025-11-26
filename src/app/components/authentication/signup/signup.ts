import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Authentication } from '../../../services/authentication';
import { Jwtres } from '../../../models/jwtres';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {

  signupForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // roles que se pueden registrar
  roles = [
    { value: 'inversionista', label: 'Inversionista' },
    { value: 'crowdfounder', label: 'Crowdfounder' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: Authentication,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required]],
      phone: [null],
      role: ['inversionista', [Validators.required]],

      // Campos específicos para crowdfounder:
      bio: [''],
      organization: [''],
      website: [''],
    });

    // Cuando cambie el rol, actualizamos validación de organization
    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      const organizationControl = this.signupForm.get('organization');

      if (role === 'crowdfounder') {
        organizationControl?.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        organizationControl?.clearValidators();
        organizationControl?.setValue('');
      }

      organizationControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Tomamos todo el formulario base
    const formValue = this.signupForm.value;

    // Creamos el payload que realmente vamos a enviar al backend
    const payload: any = { ...formValue };

    // Si el rol es inversionista, agregamos los campos que espera investorSchema
   if (payload.role === 'inversionista') {
    payload.balance = {
      amount: 0,
      currency: 'COP',// si luego quieres, esto puede salir de un select
    };

    payload.investedAmount = {
      total: 0,
      currency: 'COP',
    };

    payload.investmentCount = {
      total: 0,
    };

    payload.inversiones = [];
    payload.rating = 0;
    }

    this.authService.signup(payload).subscribe({
      next: (res: Jwtres) => {
        this.loading = false;

        if (res?.ok === false) {
          this.error = res.message || 'No fue posible crear la cuenta.';
          return;
        }

        this.success = 'Cuenta creada correctamente. Ahora puedes iniciar sesión.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Ocurrió un error al registrar el usuario.';
      }
    });
  }
//Mayor facilidad al momento de realizar el HTML
  get userName() { return this.signupForm.get('userName'); }
  get mail() { return this.signupForm.get('mail'); }
  get password() { return this.signupForm.get('password'); }
  get country() { return this.signupForm.get('country'); }
  get roleCtrl() { return this.signupForm.get('role'); }
  get organization() { return this.signupForm.get('organization'); }
}
