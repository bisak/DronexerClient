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

  private apiUrl = this.apiService.apiUrl;

  constructor(private http: Http, private apiService: ApiService) {
  }

  uploadPicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/pictures/upload`, formData)
      .map(this.apiService.extractData)
      .catch(this.apiService.handleError)
  }

}
