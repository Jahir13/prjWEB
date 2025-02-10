import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurcharsesComponent } from './purcharses.component';

describe('PurcharsesComponent', () => {
  let component: PurcharsesComponent;
  let fixture: ComponentFixture<PurcharsesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurcharsesComponent]
    });
    fixture = TestBed.createComponent(PurcharsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
