import { TestBed } from '@angular/core/testing';

import { CardSelectionService } from './card-selection.service';

describe('ClickCardService', () => {
  let service: CardSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
