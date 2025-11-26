import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign';
import { Campaign } from '../../models/campaign';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-campaign',
  imports: [CommonModule, RouterModule],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css'
})
export class CampaignComponent {

  campaigns: Campaign[] = [];
  loading = false;
  error: string | null = null;

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getAll().subscribe({
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