import { TestBed } from '@angular/core/testing';

import { MusicInfoService } from './music-info.service';

describe('MusicInfoService', () => {
  let service: MusicInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
