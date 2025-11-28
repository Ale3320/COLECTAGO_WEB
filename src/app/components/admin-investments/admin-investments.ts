import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvestmentService } from '../../services/investment-service';

@Component({
  selector: 'app-admin-investments',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-investments.html',
  styleUrls: ['./admin-investments.css']
})
export class AdminInvestmentsComponent {

  investments: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.errorMsg = '';

    this.investmentService.getAllInvestments().subscribe({
      next: (resp) => {
        this.loading = false;

        if (!resp.ok) {
          this.errorMsg = resp.message ?? 'No se pudieron cargar las inversiones.';
          return;
        }

        this.investments = resp.investments;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Error de conexión con el servidor.';
      }
    });
  }
}
