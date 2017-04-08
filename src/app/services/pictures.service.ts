import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ApiService} from "./api.service";

@Injectable()
export class PicturesService {
  constructor(private apiService: ApiService) {
  }

  uploadPicture(formData: FormData): Observable<any> {
    return this.apiService.post(`pictures/upload`, formData)
  }

  getWallPosts(username: string): Observable<any> {
    return this.apiService.get(`pictures/${username}`)
  }

  getExplorePosts(time: string): Observable<any> {
    return this.apiService.get(`pictures/explore?before=${time}`)
  }

  getProfilePicUrl(username: string): string {
    return `${this.apiService.apiUrl}users/profilePicture/${username}`
  }

  handleNotFoundProfilePic(ev) {
    ev.target.src = `${this.apiService.apiUrl}users/profilePicture/default_profile_picture`
  }
}
