import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class LandingPageComponent {
  asteroids: any[] = [];
  apiKey = 'rSKMvja2az1LSJjow1LxkksWm62hmQvA6stmzltH';
  datePipe = new DatePipe('en-US');
  asteroidCount: number = 0;
  smallestDiameter: number = 0;
  largestDiameter: number = 0;
  isLoading = false;
  asteroidForm: FormGroup = new FormGroup({
      date: new FormControl(new Date().toISOString())
  });

  startDate: string = new Date().toISOString().slice(0, 10);
  date: string = ''; // propriété pour stocker la date de recherche

  private apiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';

  images: string[] = [];
  currentImageIndex = 0;
  timerId: any;

  constructor(private http: HttpClient) {}

  onSubmit() {
      if (this.asteroidForm) {
          this.isLoading = true;
          this.date = this.asteroidForm.get('date')?.value;
          const myDate = new Date(this.date);
          const formattedDate: any = this.datePipe.transform(myDate, 'yyyy-MM-dd');
          this.startDate = formattedDate; //stocker la date de recherche
          this.date = formattedDate; //stocker la date de recherche

          this.getNearEarthObjects(formattedDate, formattedDate, this.apiKey)
              .subscribe((data: any) => {
                  // Récupérez les données d'intérêt
                  this.asteroids = data.near_earth_objects[formattedDate];
                  this.asteroidCount = this.asteroids.length;
                  this.calculateDiameters();
                  this.isLoading = false; // set isLoading to false once data is loaded
              });
      }
  }

  ngOnInit() {
      const startDate = this.startDate;
      const endDate = this.startDate;
      this.date = this.startDate;
      this.getNearEarthObjects(startDate, endDate, this.apiKey)
          .subscribe((data: any) => {
              // Récupérez les données d'intérêt
              this.asteroids = data.near_earth_objects[startDate];
              this.asteroidCount = this.asteroids.length;
              this.calculateDiameters();
          });

  }

  getNearEarthObjects(startDate: string, endDate: string, apiKey: string) {
      const url = `${this.apiUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
      return this.http.get(url);
  }

  calculateDiameters() {
      const diameters = this.asteroids.map(a => a.estimated_diameter.kilometers.estimated_diameter_min);
      this.smallestDiameter = Math.min(...diameters);
      this.largestDiameter = Math.max(...diameters);
  }




}
