import { Injectable } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt'
import { Headers, Http, Response } from "@angular/http"
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/map'
import { ApiService } from "./api.service";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {

  constructor(private apiService: ApiService) {
  }

  registerUser(user: FormData): Observable<any> {
    return this.apiService.post(`auth/register`, user)
  }

  loginUser(user): Observable<any> {
    return this.apiService.post(`auth/login`, user)
  }
}
