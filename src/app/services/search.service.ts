import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { ApiService } from './api.service';

@Injectable()
export class SearchService {

  constructor(private apiService: ApiService) {
  }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    if (term.length) {
      if (term.startsWith('#')) {
        const search = term.substring(1);
        return this.apiService.get(`search/tags/?search=${search}`);
      } else {
        return this.apiService.get(`search/users/?search=${term}`);
      }
    } else {
      return Observable.empty(); // TODO dirty hack?
    }
  }
}
