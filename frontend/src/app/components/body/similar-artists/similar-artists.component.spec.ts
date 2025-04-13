import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarArtistsComponent } from './similar-artists.component';

describe('SimilarArtistsComponent', () => {
  let component: SimilarArtistsComponent;
  let fixture: ComponentFixture<SimilarArtistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarArtistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
