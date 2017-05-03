import { TestBed, async, inject } from '@angular/core/testing';

import { ReverseAuthGuard } from './reverse-auth.guard';

describe('ReverseAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReverseAuthGuard]
    });
  });

  it('should ...', inject([ReverseAuthGuard], (guard: ReverseAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
