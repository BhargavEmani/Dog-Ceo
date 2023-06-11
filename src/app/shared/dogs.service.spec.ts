import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DogsService } from './dogs.service';

describe('DogsService', () => {
  let service: DogsService;
  let httpMock: HttpTestingController;

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dog breeds', () => {
    const dummyBreeds = {
      message: {
        breed1: ['sub-breed1', 'sub-breed2'],
        breed2: []
      },
      status: 'success'
    };

    service.getDogBreeds().subscribe((breeds) => {
      expect(breeds).toEqual(dummyBreeds);
    });

    const request = httpMock.expectOne('https://dog.ceo/api/breeds/list/all');
    expect(request.request.method).toBe('GET');
    request.flush(dummyBreeds);
  });
  

  it('should fetch breed details', () => {
    const dummyBreed = 'shiba';
    const dummyBreedDetails = {
      message: 'https://dummydogimages.com/shiba.jpg',
      status: 'success'
    };

    service.getBreedDetails(dummyBreed).subscribe((breedDetails) => {
      expect(breedDetails).toEqual(dummyBreedDetails);
    });

    const request = httpMock.expectOne(`https://dog.ceo/api/breed/${dummyBreed}/images/random`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyBreedDetails);
  });
});
