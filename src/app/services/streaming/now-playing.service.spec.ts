import { TestBed } from '@angular/core/testing';

import { NowPlayingService } from './now-playing.service';

describe('NowPlayingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NowPlayingService = TestBed.get(NowPlayingService);
    expect(service).toBeTruthy();
  });
});
