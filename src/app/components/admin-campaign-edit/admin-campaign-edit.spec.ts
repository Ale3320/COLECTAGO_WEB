import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignEdit } from './admin-campaign-edit';

describe('AdminCampaignEdit', () => {
  let component: AdminCampaignEdit;
  let fixture: ComponentFixture<AdminCampaignEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCampaignEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCampaignEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
