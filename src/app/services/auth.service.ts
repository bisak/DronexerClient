import { Injectable } from '@angular/core';

import { Observable } from "rxjs/Observable"
import { ApiService } from "./api.service";

@Injectable()
export class AuthService {

  constructor(private apiService: ApiService) {
  }

  registerUser(user: FormData): Observable<any> {
    return this.apiService.post(`auth/register`, user);
  }

  loginUser(user): Observable<any> {
    return this.apiService.post(`auth/login`, user);
  }
}
