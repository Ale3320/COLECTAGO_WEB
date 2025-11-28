import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {

  apiUri = '/api/investments';
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) {
  }


  newInvestment(data: any): Observable<any> {
  return this.http.post(`${this.apiUri}/invest`, data);
}



}

