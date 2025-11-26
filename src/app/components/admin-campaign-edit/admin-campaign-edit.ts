import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CampaignService } from '../../services/campaign';
import { Authentication } from '../../services/authentication';
import { Campaign } from '../../models/campaign';

@Component({
  selector: 'app-admin-campaign-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-campaign-edit.html',
  styleUrl: './admin-campaign-edit.css'
})
export class AdminCampaignEditComponent {

  campaignForm!: FormGroup;
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  campaignId: string | null = null;
  currentUser: any = null;

  selectedFile: File | null = null;
  campaignLoaded: Campaign | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private auth: Authentication
  ) {}

  ngOnInit(): void {
    // validar admin
    if (!this.auth.isLoggedIn()) {
      this.error = 'Debes iniciar sesión.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.auth.getUser();
    if (!this.currentUser || this.currentUser.role !== 'administrador') {
      this.error = 'No tienes permisos para editar campañas.';
      this.loading = false;
      this.router.navigate(['/']);
      return;
    }

    this.campaignId = this.route.snapshot.paramMap.get('id');
    if (!this.campaignId) {
      this.error = 'No se proporcionó un ID de campaña válido.';
      this.loading = false;
      return;
    }

    // inicializar form vacío
    this.campaignForm = this.fb.group({
      campaignName: ['', [Validators.required, Validators.minLength(3)]],
      NIT: ['', [Validators.required]],
      campaignObjectives: ['', [Validators.required, Validators.minLength(10)]],
      serviceOrProduct: ['', [Validators.required, Validators.minLength(5)]],
      activeOrInactive: ['inactivo', [Validators.required]],
    });

    this.loadCampaign();
  }

  loadCampaign(): void {
    this.loading = true;
    this.campaignService.getById(this.campaignId as string).subscribe({
      next: (campaign) => {
        if (!campaign) {
          this.error = 'No se encontró la campaña.';
          this.loading = false;
          return;
        }

        this.campaignLoaded = campaign;

        this.campaignForm.patchValue({
          campaignName: campaign.campaignName,
          NIT: campaign.NIT,
          campaignObjectives: campaign.campaignObjectives,
          serviceOrProduct: campaign.serviceOrProduct,
          activeOrInactive: campaign.activeOrInactive || 'inactivo',
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar la campaña.';
        this.loading = false;
      }
    });
  }

  // seleccionar nuevo PDF (opcional)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.campaignId || !this.currentUser?._id) {
      this.error = 'No se pudo identificar la campaña o el administrador.';
      return;
    }

    this.error = null;
    this.success = null;

    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const value = this.campaignForm.value;
    const formData = new FormData();

    // Campos que el admin puede editar
    formData.append('campaignName', value.campaignName);
    formData.append('NIT', value.NIT);
    formData.append('campaignObjectives', value.campaignObjectives);
    formData.append('serviceOrProduct', value.serviceOrProduct);
    formData.append('activeOrInactive', value.activeOrInactive);

    // PDF opcional
    if (this.selectedFile) {
      formData.append('articlesOfIncorporation', this.selectedFile);
    }

    this.campaignService.update(this.campaignId, formData, this.currentUser._id).subscribe({
      next: (res: any) => {
        console.log('Respuesta updateCampaign:', res);
        this.saving = false;
        if (res.ok) {
          this.success = 'Campaña actualizada correctamente.';
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1500);
        } else {
          this.error = res.message || 'No fue posible actualizar la campaña.';
        }
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.error = err.error?.message || 'Error al actualizar la campaña.';
      }
    });
  }

  get campaignName() { return this.campaignForm.get('campaignName'); }
  get NITCtrl() { return this.campaignForm.get('NIT'); }
  get campaignObjectives() { return this.campaignForm.get('campaignObjectives'); }
  get serviceOrProduct() { return this.campaignForm.get('serviceOrProduct'); }
  get activeOrInactive() { return this.campaignForm.get('activeOrInactive'); }
}
