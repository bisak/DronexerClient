import { JwtHelper, tokenNotExpired } from 'angular2-jwt';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject'

@Injectable()
export class AuthHelperService {
  jwtHelper: JwtHelper = new JwtHelper()
  loginAnnouncedSource = new Subject<boolean>()
  loginAnnounced: Observable<any> = this.loginAnnouncedSource.asObservable()

  constructor(private router: Router) {
  }


  storeUserData (token) {
    localStorage.setItem('id_token', token)
    this.loginAnnouncedSource.next(true)
  }

  getAuthToken () {
    return localStorage.getItem('id_token')
  }

  getDecodedAuthToken () {
    const token = this.getAuthToken()
    if (token) {
      return this.jwtHelper.decodeToken(token)._doc
    }
    return null
  }

  isLoggedIn () {
    return tokenNotExpired('id_token')
  }

  getUsernameFromToken () {
    const decodedToken = this.getDecodedAuthToken();
    if (decodedToken) {
      return decodedToken.username
    }
    return null
  }

  getUserIdFromToken () {
    const decodedToken = this.getDecodedAuthToken();
    if (decodedToken) {
      return decodedToken._id
    }
    return null
  }

  logout () {
    localStorage.clear()
  }
}
