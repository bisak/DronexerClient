import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthHelperService {

  constructor(private router: Router) {
  }

  private jwtHelper: JwtHelper = new JwtHelper()

  private loginAnnouncedSource = new Subject<boolean>()
  loginAnnounced: Observable<any> = this.loginAnnouncedSource.asObservable()

  storeUserData(token, user) {
    localStorage.setItem('id_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.loginAnnouncedSource.next(true)
  }

  getAuthToken() {
    return localStorage.getItem('id_token')
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  getDecodedAuthToken() {
    const token = localStorage.getItem('id_token')
    if (token)
      return this.jwtHelper.decodeToken(token)
  }

  isLoggedIn() {
    return tokenNotExpired()
  }

  getUsernameFromToken() {
    let token = this.getAuthToken();
    if (token) {
      let decodedToken = this.jwtHelper.decodeToken(token)
      return decodedToken._doc.username
    }
    return null
  }

  logout() {
    localStorage.clear()
  }

  blockLoggedInAccess() {
    if (this.isLoggedIn()) {
      this.router.navigate([''])
    }
  }

}
