import { Injectable } from '@angular/core';
import { Headers, Http, Response } from "@angular/http"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'
import { AuthService } from "./auth.service";
import { AuthHelperService } from "../utilities/auth-helper.service";

@Injectable()
export class ApiService {

  constructor(private http: Http,
              private authHelperService: AuthHelperService) {
  }

  public apiUrl = environment.apiUrl

  get(path: string) {
    let headers = new Headers();
    headers.append('Authorization', this.authHelperService.getAuthToken())
    headers.append('Content-Type', 'application/json')
    return this.http.get(`${this.apiUrl}${path}`, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }

  post(path: string, data: any) {
    let headers = new Headers();
    headers.append('Authorization', this.authHelperService.getAuthToken())
    if ((data instanceof FormData) == false) {
      headers.append('Content-Type', 'application/json')
    }
    return this.http.post(`${this.apiUrl}${path}`, data, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(error);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

}
