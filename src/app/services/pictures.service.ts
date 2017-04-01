import { Injectable } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt'
import { Headers, Http, Response } from "@angular/http"
import { AuthService } from './auth.service'
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

  getWallPosts(username: string): Observable<any> {
    return this.apiService.get(`pictures/${username}`)
  }

  commentPicture(id, data): Observable<any> {
    return this.apiService.post(`pictures/comment/${id}`, data)
  }

  getProfilePictureUrl(username: string): string {
    return `${this.apiService.apiUrl}users/profilePicture/${username}`
  }

  handleNotFoundProfilePicture(ev) {
    ev.target.src = `${this.apiService.apiUrl}users/profilePicture/default_profile_picture`
  }

  getProfilePictureUrlForPost(post) {
    return `${this.apiService.apiUrl}users/profilePicture/${post.uploaderUsername}`
  }

  getPictureUrlForPost(post) {
    return `${this.apiService.apiUrl}pictures/big/${post._id}`
  }
}
