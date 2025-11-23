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

  // GET /api/seeCampaigns
  getAll(): Observable<Campaign[]> {
    return this.http
      .get<{ ok: boolean; total: number; campaigns: Campaign[] }>(
        `${this.apiUri}/seeCampaigns`
      )
      .pipe(map(res => res.campaigns));
  }

  // Busca una campaña por ID (filtrando sobre getAll)
  getById(id: string): Observable<Campaign | null> {
    return this.getAll().pipe(
      map(campaigns => campaigns.find(c => c._id === id) ?? null)
    );
  }

  // POST /api/newCampaign
  create(formData: FormData) {
    return this.http.post(`${this.apiUri}/newCampaign`, formData);
  }

  // DELETE /api/campaigns/:id?adminId=...
  delete(id: string, adminId: string) {
    return this.http.delete(`${this.apiUri}/campaigns/${id}`, {
      params: { adminId }
    });
  }

  // PUT /api/updateCampaign/:id?adminId=...
  update(id: string, formData: FormData, adminId: string) {
    return this.http.put(`${this.apiUri}/updateCampaign/${id}`, formData, {
      params: { adminId }
    });
  }

  // GET /api/seePDFCampaign/:id/pdf
  getPdf(id: string) {
    return this.http.get(`${this.apiUri}/seePDFCampaign/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}