import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampaignService } from '../../services/campaign';
import { Authentication } from '../../services/authentication';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-campaigns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-campaigns.html',
  styleUrl: './admin-campaigns.css'
})
export class AdminCampaignsComponent {

  campaigns: any[] = [];
  currentUser: any = null;

  loading = true;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private campaignService: CampaignService,
    private auth: Authentication,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // validar rol
    if (!this.auth.isLoggedIn()) {
      this.error = 'Debes iniciar sesión.';
      return;
    }

    this.currentUser = this.auth.getUser();
    if (!this.currentUser || this.currentUser.role !== 'administrador') {
      this.error = 'No tienes permisos para ver esta página.';
      return;
    }

    this.loadCampaigns();
  }

  loadCampaigns() {
    this.campaignService.getAll().subscribe({
      next: (res) => {
        this.campaigns = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando campañas.';
        this.loading = false;
      }
    });
  }
  openPdf(campaignId: string): void {
    if (!campaignId) return;

    const url = `http://localhost:3000/api/campaigns/seePDFCampaign/${campaignId}/pdf`;
    window.open(url, '_blank');
  }

  approve(id: string) {
    const adminId = this.currentUser._id;

    this.http.put(
      `http://localhost:3000/api/campaigns/updateCampaign/${id}?adminId=${adminId}`,
      { activeOrInactive: 'activo' }
    ).subscribe({
      next: (res: any) => {
        if (res.ok) {
          this.success = 'Campaña aprobada.';
          this.loadCampaigns();
        } else {
          this.error = res.message;
        }
      },
      error: () => this.error = 'Error al aprobar campaña.'
    });
  }

  delete(id: string) {
    const adminId = this.currentUser?._id;
    if (!adminId) {
      this.error = 'No se encontró el ID del administrador.';
      return;
    }

    this.error = null;
    this.success = null;

    this.campaignService.delete(id, adminId).subscribe({
      next: (res: any) => {
        console.log('Respuesta DELETE campaña:', res);

        if (res.ok) {
          this.success = 'Campaña eliminada.';
          this.loadCampaigns();
        } else {
          this.error = res.message || 'No fue posible eliminar la campaña.';
        }
      },
      error: (err) => {
        console.error('Error HTTP al eliminar campaña:', err);
        this.error = err.error?.message || 'Error al eliminar campaña.';
      }
    });
  }
}
