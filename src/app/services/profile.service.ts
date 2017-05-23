import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Headers, Http, Response } from '@angular/http'
import { JwtHelper, tokenNotExpired } from 'angular2-jwt'

import { ApiService } from './api.service';
import { AuthService } from './auth.service'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileService {
  authToken: any;
  user: any;
  private apiUrl = this.apiService.apiUrl;

  constructor(private http: Http, private apiService: ApiService) {
  }

  getProfile (username: string): Observable<any> {
    return this.apiService.get(`users/profile-info/${username}`);
  }

  editProfileInfo (data): Observable<any> {
    return this.apiService.post(`users/edit-profile`, data);
  }

  deleteProfile (data): Observable<any> {
    return this.apiService.post(`users/delete-profile`, data);
  }

}
