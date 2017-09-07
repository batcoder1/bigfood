import { TestBed, inject } from '@angular/core/testing';

import { GoogleFitService } from './google-fit.service';

describe('GoogleFitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleFitService]
    });
  });

  it('should be created', inject([GoogleFitService], (service: GoogleFitService) => {
    expect(service).toBeTruthy();
  }));
});
