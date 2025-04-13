import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoArtworksComponent } from './no-artworks.component';

describe('NoArtworksComponent', () => {
  let component: NoArtworksComponent;
  let fixture: ComponentFixture<NoArtworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoArtworksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoArtworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
