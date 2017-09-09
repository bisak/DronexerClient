import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs/Subject';
import { PicturesService } from '../../services/pictures.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm = new Subject<string>();
  results;
  canShowDropDown = false;

  constructor(private searchService: SearchService,
              private picturesService: PicturesService) {
  }

  ngOnInit() {
    this.searchService.search(this.searchTerm).subscribe(results => {
      this.results = results;
      if (results.users) {
        this.results.data.map((result) => {
          return result.profilePicUrl = this.picturesService.getProfilePicUrl(result._id);
        });
      }
    });
  }

  onFocus(ev) {
    setTimeout(() => {
      this.canShowDropDown = true;
    }, 400);
  }

  onBlur(ev) {
    setTimeout(() => {
      this.canShowDropDown = false;
    }, 400);
  }

}
