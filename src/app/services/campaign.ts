// src/app/services/campaign.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Campaign } from '../models/campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  apiUri = '/api/campaigns';

  constructor(private http: HttpClient) {}

  // GET /api/campaigns/seeCampaigns
  getAll(): Observable<Campaign[]> {
    return this.http
      .get<{ ok: boolean; total: number; campaigns: Campaign[] }>(
        `${this.apiUri}/seeCampaigns`
      )
      .pipe(map(res => res.campaigns));
  }

  // GET /api/campaigns/seeCampaignsByOwner/:ownerId
getByOwner(ownerId: string): Observable<Campaign[]> {
  return this.http
    .get<{ ok: boolean; total: number; campaigns: Campaign[] }>(
      `${this.apiUri}/seeCampaignsByOwner/${ownerId}`
    )
    .pipe(map(res => res.campaigns));
}

  // Busca una campaña por ID (filtrando sobre getAll)
  getById(id: string): Observable<Campaign | null> {
    return this.getAll().pipe(
      map(campaigns => campaigns.find(c => c._id === id) ?? null)
    );
  }

  // POST /api/campaigns/newCampaign
  create(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUri}/newCampaign`, formData);
  }

  // DELETE /api/campaigns/deleteCampaign/:id?adminId=...
  delete(id: string, adminId: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/deleteCampaign/${id}`, {
      params: { adminId }
    });
  }

  // PUT /api/campaigns/updateCampaign/:id?adminId=...
  update(id: string, formData: FormData, adminId: string) {
    return this.http.put(`${this.apiUri}/updateCampaign/${id}`, formData, {
      params: { adminId }
    });
  }

  // GET /api/campaigns/seePDFCampaign/:id/pdf
  getPdf(id: string) {
    return this.http.get(`${this.apiUri}/seePDFCampaign/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}