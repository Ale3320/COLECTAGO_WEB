import { Component } from '@angular/core';
import { InvestmentService } from '../../services/investment-service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { Campaign } from '../../models/campaign';

@Component({
  selector: 'app-investment',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './investment.html',
  styleUrls: ['./investment.css']
})
export class InvestmentComponent {

  campaignId: string | null = null;
  investorId: string | null = null;

  investmentForm!: FormGroup;
  loading = false;

  errorMsg = '';
  successMsg = '';

  constructor(
    private investmentService: InvestmentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: Authentication
  ) { }

  ngOnInit(): void {

    const user = this.authService.getUser();
    this.investorId = user?._id ?? null;

    this.campaignId = this.route.snapshot.paramMap.get('id');

    if (!this.campaignId) {
      this.errorMsg = 'No se encontró la campaña.';
      return;
    }

    this.investmentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  createInvestment() {
    if (this.investmentForm.invalid) {
      this.errorMsg = 'Debes ingresar un monto válido.';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';
    this.loading = true;

    const body = {
      amount: Number(this.investmentForm.value.amount),
      campaign: this.campaignId,
      investor: this.investorId
    };

    this.investmentService.newInvestment(body).subscribe({
      next: (resp) => {
        this.loading = false;

        if (!resp.ok) {
          this.errorMsg = resp.message ?? 'No se pudo crear la inversión.';
          return;
        }

        this.successMsg = 'Inversión creada correctamente.';

        // Limpia el formulario
        this.investmentForm.reset();

        // Redirige luego de 1.2 segundos
        setTimeout(() => {
          this.router.navigate(['/campaign', this.campaignId]);
        }, 1200);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Error de conexión con el servidor.';
      }
    });

  }

}
