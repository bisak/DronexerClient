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

    return null
  }

  isLoggedIn() {
    return tokenNotExpired()
  }

  getUsernameFromToken() {
    let decodedToken = this.getDecodedAuthToken();
    if (decodedToken) {
      return decodedToken._doc.username
    }
    return null
  }

  getIdFromToken() {
    let decodedToken = this.getDecodedAuthToken();
    if (decodedToken) {
      return decodedToken._doc._id
    }
    return null
  }

  logout() {
    localStorage.clear()
  }

  blockLoggedInAccess() { //TODO fix (move) this
    if (this.isLoggedIn()) {
      this.router.navigate([''])
    }
  }

}
