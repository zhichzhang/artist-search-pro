import { TestBed } from '@angular/core/testing';

import { SimilarArtistsService } from './similar-artists.service';

describe('SimilarCardsService', () => {
  let service: SimilarArtistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarArtistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
