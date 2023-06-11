import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DogBreedsComponent } from './dog-breeds.component';
import { DogsService } from '../shared/dogs.service';
import { of, throwError } from 'rxjs';
import { BreedData } from '../shared/dogs.model';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

describe('DogBreedsComponent', () => {
  let component: DogBreedsComponent;
  let fixture: ComponentFixture<DogBreedsComponent>;
  let mockDogService: jasmine.SpyObj<DogsService>;

  beforeEach(async(() => {
    mockDogService = jasmine.createSpyObj('DogsService', ['getDogBreeds', 'getBreedDetails']);

    TestBed.configureTestingModule({
      declarations: [DogBreedsComponent],
      providers: [{ provide: DogsService, useValue: mockDogService }],
      imports: [FormsModule, MatProgressSpinnerModule, MatCardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogBreedsComponent);
    component = fixture.componentInstance;
  });

  it('should create the DogBreedsComponent', () => {
    expect(component).toBeTruthy();
  });

  
});
