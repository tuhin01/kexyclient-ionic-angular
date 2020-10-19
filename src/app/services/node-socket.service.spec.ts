import { TestBed } from '@angular/core/testing';

import { NodeSocketService } from './node-socket.service';

describe('NodeSocketService', () => {
  let service: NodeSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
