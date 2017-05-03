import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthHelperService {

  constructor(private router: Router) {
  }

  jwtHelper: JwtHelper = new JwtHelper()

  loginAnnouncedSource = new Subject<boolean>()
  loginAnnounced: Observable<any> = this.loginAnnouncedSource.asObservable()

  storeUserData(token) {
    localStorage.setItem('id_token', token)
    this.loginAnnouncedSource.next(true)
  }

  getAuthToken() {
    return localStorage.getItem('id_token')
  }

  getDecodedAuthToken() {
    const token = this.getAuthToken()
    if (token) return this.jwtHelper.decodeToken(token)._doc
    return null
  }

  isLoggedIn() {
    return tokenNotExpired('id_token')
  }

  getUsernameFromToken() {
    let decodedToken = this.getDecodedAuthToken();
    if (decodedToken) return decodedToken.username
    return null
  }

  getUserIdFromToken() {
    let decodedToken = this.getDecodedAuthToken();
    if (decodedToken) return decodedToken._id
    return null
  }

  logout() {
    localStorage.clear()
  }
}
