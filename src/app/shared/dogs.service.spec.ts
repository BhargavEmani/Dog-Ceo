import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DogsService } from './dogs.service';
import { BreedData, BreedDetails } from './dogs.model';

describe('DogsService', () => {
  let service: DogsService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://dog.ceo/api/breed';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DogsService]
    });
    service = TestBed.inject(DogsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should fetch all dog breeds', () => {
    const dummyBreeds: BreedData = {
      message: { 'hound': [] },
      status: 'success'
    };

    service.getDogBreeds().subscribe(breeds => {
      expect(breeds).toEqual(dummyBreeds);
    });

    const request = httpMock.expectOne(`${baseUrl}s/list/all`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyBreeds);
  });

  it('should fetch breed details', () => {
    const dummyBreedDetails: BreedDetails = {
      message: 'https://images.dog.ceo/breeds/hound-english/j00exlqsr.jpg',
      status: 'success'
    };

    service.getBreedDetails('hound').subscribe(details => {
      expect(details).toEqual(dummyBreedDetails);
    });

    const request = httpMock.expectOne(`${baseUrl}/hound/images/random`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyBreedDetails);
  });
  it('should handle server-side error', () => {
    const errorMessage = 'Server-side error';
  
    service.getDogBreeds().subscribe(
      () => fail('should have failed with the server error'),
      (error: Error) => expect(error.message).toContain(`Error Code: 500`)
    );
  
    const request = httpMock.expectOne(`${baseUrl}s/list/all`);
    request.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
  
  it('should handle client-side error', () => {
    const errorEvent = new ErrorEvent('Client Error', { message: 'Client-side error' });
  
    service.getDogBreeds().subscribe(
      () => fail('should have failed with the client error'),
      (error: Error) => expect(error.message).toContain('Client-side error')
    );
  
    const request = httpMock.expectOne(`${baseUrl}s/list/all`);
    request.error(errorEvent);
  });
  
});
