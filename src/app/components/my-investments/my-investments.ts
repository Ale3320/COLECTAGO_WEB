import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvestmentService } from '../../services/investment-service';
import { Authentication } from '../../services/authentication';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-investments',
  imports: [
    CommonModule,
    RouterModule,   
    CurrencyPipe,   
    DatePipe      
  ],
  templateUrl: './my-investments.html',
  styleUrls: ['./my-investments.css']
})
export class MyInvestmentsComponent {

  investments: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private investmentService: InvestmentService,
    private auth: Authentication
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    const investorId = user?._id;

    if (!investorId) {
      this.errorMsg = 'No se pudo obtener tu sesión.';
      this.loading = false;
      return;
    }

    this.investmentService.getInvestmentsByInvestor(investorId)
      .subscribe({
        next: (resp) => {
          this.loading = false;

          if (!resp.ok) {
            this.errorMsg = resp.message ?? 'No se pudieron cargar tus inversiones.';
            return;
          }

          this.investments = resp.investments;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Error al conectar con el servidor.';
        }
      });
  }
}
