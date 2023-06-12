import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DogBreedsComponent } from './dog-breeds.component';
import { DogsService } from '../shared/dogs.service';
import { Subject, of, throwError } from 'rxjs';
import { BreedData } from '../shared/dogs.model';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DogBreedsComponent', () => {
  let component: DogBreedsComponent;
  let fixture: ComponentFixture<DogBreedsComponent>;
  let mockDogService: jasmine.SpyObj<DogsService>;

  beforeEach(async(() => {
    mockDogService = jasmine.createSpyObj('DogsService', ['getDogBreeds', 'getBreedDetails']);

    TestBed.configureTestingModule({
      declarations: [DogBreedsComponent],
      providers: [{ provide: DogsService, useValue: mockDogService }],
      imports: [FormsModule, MatProgressSpinnerModule, MatCardModule, MatToolbarModule, 
        MatIconModule, MatFormFieldModule, MatSelectModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogBreedsComponent);
    component = fixture.componentInstance;
  });

  it('should create the DogBreedsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch breed data on initialization', () => {
    const breedData: BreedData = {
      message: {
        terrier: [],
        labrador: ['brown', 'black']
      },
      status: 'success'
    };
    mockDogService.getDogBreeds.and.returnValue(of(breedData));
    mockDogService.getBreedDetails.and.returnValue(of({ message: 'image-url', status: 'success' }));

    fixture.detectChanges();

    expect(component.breedList).toEqual(['terrier', 'brown labrador', 'black labrador']);
    expect(component.selectedBreed).toEqual('terrier');
    expect(component.dogImage).toEqual('image-url');
    expect(component.loadingBar).toBeFalsy();
  });

  it('should handle error when fetching breed images', () => {
    const breedData: BreedData = {
      message: {
        terrier: [],
        labrador: ['brown', 'black']
      },
      status: 'success'
    };
    mockDogService.getDogBreeds.and.returnValue(of(breedData));
    mockDogService.getBreedDetails.and.returnValue(throwError('error'));
  
    fixture.detectChanges();
  
    expect(component.errorMessage).toEqual('Failed to fetch breed details.');
    expect(component.loadingBar).toBeFalsy();
  });
  
  it('should handle error when fetching breed data', () => {
    mockDogService.getDogBreeds.and.returnValue(throwError('error'));
  
    fixture.detectChanges();
  
    expect(component.errorMessage).toEqual('Failed to fetch breed data.');
    expect(component.loadingBar).toBeFalsy();
  });
  

  it('should stop listening to services after destroy', () => {
    const breedData$ = new Subject<BreedData>();
    const breedDetails$ = new Subject<any>();
  
    mockDogService.getDogBreeds.and.returnValue(breedData$);
    mockDogService.getBreedDetails.and.returnValue(breedDetails$);
  
    fixture.detectChanges(); 
  
    breedData$.next({
      message: {
        terrier: [],
        labrador: ['brown', 'black']
      },
      status: 'success'
    });
  
    breedDetails$.next({ message: 'image-url', status: 'success' });
  
    expect(component.breedList.length).toBeGreaterThan(0);
    expect(component.dogImage).toBeDefined();
  
    component.ngOnDestroy();
  
    breedData$.next({
      message: {
        hound: [],
        retriever: ['golden']
      },
      status: 'success'
    });
  
    breedDetails$.next({ message: 'image-url-2', status: 'success' });
  
    expect(component.breedList).toEqual(['terrier', 'brown labrador', 'black labrador']);
    expect(component.dogImage).not.toEqual('image-url-2');
  });
});
