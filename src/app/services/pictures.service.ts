import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ApiService } from "./api.service";

@Injectable()
export class PicturesService {
  constructor(private apiService: ApiService) {
  }

  uploadPicture(formData: FormData): Observable<any> {
    return this.apiService.post(`pictures/upload`, formData)
  }

  getWallPosts(username: string, time: number): Observable<any> {
    return this.apiService.get(`pictures/${username}?before=${time}`)
  }

  getExplorePosts(time: number): Observable<any> {
    return this.apiService.get(`pictures/explore?before=${time}`)
  }

  getProfilePicUrl(username: string): string {
    return `${this.apiService.apiUrl}users/profile-picture/${username}?${Math.floor(Math.random() * (1000000 - 1)) + 1}`
  }

}
