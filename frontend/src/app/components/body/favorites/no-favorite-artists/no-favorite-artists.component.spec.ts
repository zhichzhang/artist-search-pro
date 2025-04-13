import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoFavoriteArtistsComponent } from './no-favorite-artists.component';

describe('NoFavoriteArtistsComponent', () => {
  let component: NoFavoriteArtistsComponent;
  let fixture: ComponentFixture<NoFavoriteArtistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoFavoriteArtistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoFavoriteArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
