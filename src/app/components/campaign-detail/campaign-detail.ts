import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CampaignService } from '../../services/campaign';
import { Campaign } from '../../models/campaign';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-campaign-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './campaign-detail.html',
  styleUrl: './campaign-detail.css'
})
export class CampaignDetailComponent {

  campaign: Campaign | null = null;
  loading = true;
  error: string | null = null;

  isLoggedIn = false;
  role: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authService: Authentication
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRole();
    console.log('Detalle campaña -> isLoggedIn:', this.isLoggedIn, 'role:', this.role);

    if (!id) {
      this.error = 'No se proporcionó un ID de campaña válido.';
      this.loading = false;
      return;
    }

    this.campaignService.getById(id).subscribe({
      next: (c) => {
        if (!c) {
          this.error = 'No se encontró la campaña.';
        } else {
          this.campaign = c;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar la campaña.';
        this.loading = false;
      }
    });
  }

  get canSeePdf(): boolean {
    return this.role === 'administrador';
  }

  // URL del PDF
  getPdfUrl(): string | null {
    if (!this.campaign?._id) return null;
    return `http://localhost:3000/api/campaigns/seePDFCampaign/${this.campaign._id}/pdf`;
  }

  get isInvestor(): boolean {
    return this.role === 'inversionista';
  }

  get isCampaignActive(): boolean {
    return this.campaign?.activeOrInactive === 'activo';
  }

  get canInvest(): boolean {
    return this.isLoggedIn && this.isInvestor && this.isCampaignActive;
  }
}
