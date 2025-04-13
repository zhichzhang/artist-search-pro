import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryModalCardComponent } from './category-modal-card.component';

describe('CategoryModalCardComponent', () => {
  let component: CategoryModalCardComponent;
  let fixture: ComponentFixture<CategoryModalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryModalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryModalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
