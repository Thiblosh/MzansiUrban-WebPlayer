import { TestBed } from '@angular/core/testing';

import { ShowLineupService } from './show-lineup.service';

describe('ShowLineupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowLineupService = TestBed.get(ShowLineupService);
    expect(service).toBeTruthy();
  });
});
