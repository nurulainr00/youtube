import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YoutubeService } from '../youtubeservice.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css']
})
export class SearchResultComponent implements OnInit {
  videos: any[] = [];
  query: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private youtubeService: YoutubeService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'];
      this.searchVideos();
    });
  }

  searchVideos() {
    if (this.query.trim() !== ''&& !/[!@#$%^&*(),.?":{}|<>]/.test(this.query)) {
      this.youtubeService.searchVideos(this.query).pipe(
        catchError(error => {
          this.errorMessage = 'Error fetching search results. Please try again later.';
          return throwError(error);
        })
      ).subscribe((response: any) => {
        if (response.items.length === 0) {
          this.errorMessage = 'No results found. Please try a different search query.';
        } else {
          this.videos = response.items;
        }
      });
    } else {
      this.errorMessage = 'Invalid search query. Please avoid using symbols.';
    }
    }
}

