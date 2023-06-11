import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  private baseUrl = 'https://dog.ceo/api/breed';

  constructor(private http: HttpClient) { }

  getDogBreeds(): Observable<any> {
    return this.http.get(`${this.baseUrl}s/list/all`).pipe(
      catchError(this.handleError)
    );
  }

  getBreedDetails(breed: string): Observable<any> {
    console.log('breed being called', breed);
    return this.http.get(`${this.baseUrl}/${breed}/images/random`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
