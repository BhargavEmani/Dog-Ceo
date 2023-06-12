import { Component, OnInit, OnDestroy } from '@angular/core';
import { DogsService } from '../shared/dogs.service';
import { BreedData, BreedDetails } from '../shared/dogs.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dog-breeds',
  templateUrl: './dog-breeds.component.html',
  styleUrls: ['./dog-breeds.component.css']
})
export class DogBreedsComponent implements OnInit, OnDestroy {
  breedList: string[] = [];
  dogImage = '';
  loadingBar = true;
  errorMessage = '';
  selectedBreed = '';

  private subscription = new Subscription();

  constructor(private dogService: DogsService) { }

  ngOnInit() {
    this.fetchBreedData();
  }

  fetchBreedData() {
    const breedDataSubscription = this.dogService.getDogBreeds().subscribe({
      next: (data: BreedData) => {
        this.breedList = this.getBreedList(data);
        if (this.breedList.length > 0) {
          this.selectedBreed = this.breedList[0];
          this.fetchBreedImages();
        }
      },
      error: (error: Error) => {
        this.handleError(error, 'Failed to fetch breed data.')
        this.loadingBar = false;
      }
    })
    this.subscription.add(breedDataSubscription);
  }

  getBreedList(data: BreedData): string[] {
    return Object.keys(data.message).flatMap(breed => {
      const subBreeds = data.message[breed];
      return subBreeds.length > 0 ? subBreeds.map(subBreed => `${subBreed} ${breed}`) : [breed];
    });
  }

  fetchBreedImages() {
    this.loadingBar = true;
    const [breed, subBreed] = this.selectedBreed.split(' ');
    const breedDetails = subBreed ? `${subBreed}/${breed}` : breed;

    const breedImageSubscription = this.dogService.getBreedDetails(breedDetails).subscribe({
      next: (data: BreedDetails) => {
        this.dogImage = data.message;
        this.loadingBar = false;
      },
      error: (error: Error) => {
        this.handleError(error, 'Failed to fetch breed details.');
        this.loadingBar = false;
      }
    });
    this.subscription.add(breedImageSubscription);
  }

  handleError(error: any, message: string) {
    this.errorMessage = message;
    this.loadingBar = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
