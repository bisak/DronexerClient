import { Injectable } from '@angular/core';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt'
import { Headers, Http, Response } from "@angular/http"
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/map'
import { ApiService } from "./api.service";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {
  authToken: any
  user: any
  jwtHelper: JwtHelper = new JwtHelper();

  private loginAnnouncedSource = new Subject<boolean>();
  loginAnnounced = this.loginAnnouncedSource.asObservable();

  private apiUrl = this.apiService.apiUrl

  constructor(private http: Http, private apiService: ApiService) {
  }

  registerUser(user): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user)
      .map(this.apiService.extractData)
      .catch(this.apiService.handleError)
  }

  loginUser(user): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.post(`${this.apiUrl}/login`, user, { headers: headers })
      .map(this.apiService.extractData)
      .catch(this.apiService.handleError)
  }


  storeUserData(token, user) {
    localStorage.setItem('id_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token;
    this.user = user;
    this.loginAnnouncedSource.next(true);
  }

  getAuthToken() {
    return localStorage.getItem('id_token')
  }

  getDecodedAuthToken() {
    const token = this.getAuthToken()
    if (token)
      return this.jwtHelper.decodeToken(token)
  }

  isLoggedIn() {
    return tokenNotExpired()
  }

  getUsernameFromToken() {
    let token = this.getAuthToken();
    let decodedToken = this.jwtHelper.decodeToken(token)
    return decodedToken._doc.username;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear()
  }

}
