import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PicturesService {
  constructor (private apiService: ApiService) {
  }

  uploadPicture (formData: FormData): Observable<any> {
    return this.apiService.post(`pictures/upload`, formData);
  }

  getWallPosts (username: string, time: number): Observable<any> {
    return this.apiService.get(`posts/${username}?before=${time}`);
  }

  getFeedPosts (time: number): Observable<any> {
    return this.apiService.get(`posts/feed?before=${time}`);
  }

  getExplorePosts (time: number): Observable<any> {
    return this.apiService.get(`posts/explore?before=${time}`);
  }

  getTagPosts (tag: string, time: number): Observable<any> {
    return this.apiService.get(`posts/tag/${tag}?before=${time}`);
  }

  getProfilePicUrl (username: string): string {
    return `${this.apiService.apiUrl}users/profile-picture/${username}`;
  }

}
