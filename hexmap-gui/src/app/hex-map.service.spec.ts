import { TestBed } from '@angular/core/testing';

import { HexMapService } from './hex-map.service';

describe('HexMapServiceService', () => {
  let service: HexMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
