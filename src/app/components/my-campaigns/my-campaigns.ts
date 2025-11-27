import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign';
import { Campaign } from '../../models/campaign';
import { RouterModule } from '@angular/router';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-my-campaigns',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-campaigns.html',
  styleUrl: './my-campaigns.css',
})
export class MyCampaigns {
  campaigns: Campaign[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private campaignService: CampaignService,
    private authService: Authentication
  ) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.error = null;

    const user = this.authService.getUser();
    const ownerId = user?._id; // o user?._id según tu backend

    if (!ownerId) {
      this.error = 'No se encontró el usuario autenticado';
      this.loading = false;
      return;
    }
    this.campaignService.getByOwner(ownerId).subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar campañas';
        this.loading = false;
      }
    });
  }

  getProgress(c: Campaign): number {
    const goal = 1_000_000; // meta provisional, solo para mostrar la barra
    if (!goal) return 0;

    const value = (c.collected / goal) * 100;
    // lo limitamos entre 0 y 100
    return Math.min(Math.max(value, 0), 100);
  }
}
