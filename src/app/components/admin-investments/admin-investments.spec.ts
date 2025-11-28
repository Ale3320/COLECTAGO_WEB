import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestments } from './admin-investments';

describe('AdminInvestments', () => {
  let component: AdminInvestments;
  let fixture: ComponentFixture<AdminInvestments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInvestments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInvestments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
