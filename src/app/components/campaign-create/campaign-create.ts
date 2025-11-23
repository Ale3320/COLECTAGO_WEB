import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CampaignService } from '../../services/campaign';
import { Authentication } from '../../services/authentication';
import { User } from '../../models/user';

@Component({
  selector: 'app-campaign-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './campaign-create.html',
  styleUrl: './campaign-create.css'
})
export class CampaignCreateComponent implements OnInit {

  campaignForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  selectedFile: File | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private authService: Authentication,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. verificar usuario logueado y rol
    if (!this.authService.isLoggedIn()) {
      this.error = 'Debes iniciar sesión para crear una campaña.';
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getUser();

    if (!this.currentUser || this.currentUser.role !== 'crowdfounder') {
      this.error = 'Solo los crowdfounders pueden crear campañas.';
      this.router.navigate(['']);
      return;
    }

    // 2. construir formulario
    this.campaignForm = this.fb.group({
      campaignName: ['', [Validators.required, Validators.minLength(3)]],
      NIT: ['', [Validators.required]],
      campaignObjectives: ['', [Validators.required, Validators.minLength(10)]],
      serviceOrProduct: ['', [Validators.required, Validators.minLength(5)]],
      // el PDF se maneja por fuera (selectedFile)
    });
  }

  // manejo del input file
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;

    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Debes adjuntar el PDF del acta de constitución.';
      return;
    }

    if (!this.currentUser || !this.currentUser._id) {
      this.error = 'No se pudo identificar al usuario actual.';
      return;
    }

    this.loading = true;

    // 3. Construir FormData para enviar a la API
    const formValue = this.campaignForm.value;

    const formData = new FormData();
    formData.append('owner', this.currentUser._id);
    formData.append('campaignName', formValue.campaignName);
    formData.append('NIT', formValue.NIT);
    formData.append('campaignObjectives', formValue.campaignObjectives);
    formData.append('serviceOrProduct', formValue.serviceOrProduct);
    formData.append('articlesOfIncorporation', this.selectedFile);

    this.campaignService.create(formData).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.ok) {
          this.success = 'Campaña creada correctamente.';
          // después de un momento, ir al listado o al detalle
          setTimeout(() => {
            this.router.navigate(['/campaign']);
          }, 1500);
        } else {
          this.error = res?.message || 'No fue posible crear la campaña.';
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Ocurrió un error al crear la campaña.';
      }
    });
  }

//Para obtener la información más fácil en el HTML
  get campaignName() { return this.campaignForm.get('campaignName'); }
  get NITCtrl() { return this.campaignForm.get('NIT'); }
  get campaignObjectives() { return this.campaignForm.get('campaignObjectives'); }
  get serviceOrProduct() { return this.campaignForm.get('serviceOrProduct'); }
}
