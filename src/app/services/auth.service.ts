import { Injectable } from '@angular/core';

import { tokenNotExpired } from 'angular2-jwt'
import { Headers, Http, Response } from "@angular/http"
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
  authToken: any
  user: any

  private apiUrl = "http://localhost:8080/api"

  private getJson(response: Response) {
    return response.json();
  }

  constructor(private http: Http) {
  }

  registerUser(user): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user)
      .map(this.getJson)
  }

  loginUser(user): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.post(`${this.apiUrl}/login`, user, { headers: headers })
      .map(this.getJson)
  }

  /* getProfile() {
   let headers = new Headers();
   this.loadToken();
   headers.append('Authorization', this.authToken)
   headers.append('Content-Type', 'application/json')
   return this.http.get(`${this.baseUrl}/users/profile`, { headers: headers })
   .map(this.getJson)
   }
   */

  storeUserData(token, user) {
    localStorage.setItem('id_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired()
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear()
  }

}
