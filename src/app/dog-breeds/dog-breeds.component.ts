import { Component, OnInit, OnDestroy } from '@angular/core';
import { DogsService } from '../shared/dogs.service';
import { BreedData } from '../shared/dogs.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dog-breeds',
  templateUrl: './dog-breeds.component.html',
  styleUrls: ['./dog-breeds.component.css']
})
export class DogBreedsComponent implements OnInit, OnDestroy {
  breedData!: BreedData;
  breedList: string[] = [];
  selectedBreed = '';
  dogImage = '';
  loadingBar = true;
  errorMessage = '';

  private breedDataSubscription: Subscription | undefined;
  private breedImageSubscription: Subscription | undefined;

  constructor(private dogService: DogsService) { }

  ngOnInit() {
    this.fetchBreedData();
  }

  fetchBreedData() {
    this.breedDataSubscription = this.dogService.getDogBreeds().subscribe({
      next: (data: BreedData) => {
        this.breedData = data;
        this.populateBreedList();
        this.loadingBar = false;

        if (this.breedList.length > 0) {
          this.selectedBreed = this.breedList[0];
          this.breedImages();
        }
      },
    error:  (error: any) => {
        this.errorMessage = 'Failed to fetch breed data. Please try again later.';
        console.error('Failed to fetch breed data:', error);
        this.loadingBar = false;
      }
    }
     
    );
  }

  populateBreedList() {
    this.breedList = Object.keys(this.breedData.message).flatMap(breed => {
      const subBreeds = this.breedData.message[breed];
      return subBreeds.length > 0 ? subBreeds.map(subBreed => `${subBreed} ${breed}`) : [breed];
    });
  }

  breedImages() {
    this.loadingBar = true;
    const [breed, subBreed] = this.selectedBreed.split(' ');
    const breedDetails = subBreed ? `${subBreed}/${breed}` : breed; 
    this.breedImageSubscription = this.dogService.getBreedDetails(breedDetails).subscribe({

      next: (data: any) => {  
        this.dogImage = data.message; 
        this.loadingBar = false} ,
  
      error: (error: any) => {
        console.error('Failed to fetch breed details:', error);
        this.errorMessage = 'Failed to fetch breed details. Please try again later.';
        this.loadingBar = false;
      }
    }
     
    );
  }
  
  ngOnDestroy() {
    this.breedDataSubscription?.unsubscribe();
    this.breedImageSubscription?.unsubscribe();
  }
}
