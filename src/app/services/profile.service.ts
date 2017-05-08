import { Injectable } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt'
import { Headers, Http, Response } from "@angular/http"
import { AuthService } from './auth.service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ApiService } from "./api.service";

@Injectable()
export class ProfileService {
  authToken: any;
  user: any;
  private apiUrl = this.apiService.apiUrl;

  constructor(private http: Http, private apiService: ApiService) {
  }

  getProfile(username: string) {
    return this.apiService.get(`users/profile-info/${username}`);
  }

  editProfileInfo(data) {
    return this.apiService.post(`users/edit-profile`, data);
  }

  deleteProfile(data) {
    return this.apiService.post(`users/delete-profile`, data);
  }

}
