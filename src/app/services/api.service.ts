import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AuthHelperService } from '../utilities/auth-helper.service';
import { Subject } from 'rxjs';

@Injectable()
export class ApiService {
  requestPendingSource = new Subject<boolean>();
  requestAnnounced: Observable<any> = this.requestPendingSource.asObservable();

  constructor(private http: Http,
              private authHelperService: AuthHelperService) {
  }

  public apiUrl = environment.apiUrl;

  get (path: string) {
    this.requestPendingSource.next(true);
    let headers = new Headers();
    headers.append('Authorization', this.authHelperService.getAuthToken());
    headers.append('Content-Type', 'application/json');
    return this.http.get(`${this.apiUrl}${path}`, { headers: headers })
      .map((response) => this.extractData(response))
      .catch((response) => this.handleError(response));
  }

  /*TODO test with optional data parameter*/
  post(path: string, data: any) {
    this.requestPendingSource.next(true);
    let headers = new Headers();
    headers.append('Authorization', this.authHelperService.getAuthToken());
    if ((data instanceof FormData) == false) {
      headers.append('Content-Type', 'application/json');
    }
    return this.http.post(`${this.apiUrl}${path}`, data, { headers: headers })
      .map((response) => this.extractData(response))
      .catch((response) => this.handleError(response));
  }

  delete(path: string) {
    this.requestPendingSource.next(true);
    let headers = new Headers();
    headers.append('Authorization', this.authHelperService.getAuthToken());
    return this.http.delete(`${this.apiUrl}${path}`, { headers: headers })
      .map((response) => this.extractData(response))
      .catch((response) => this.handleError(response));
  }


  handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || {};
      error['parsedBody'] = body;
      const err = body.err || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.requestPendingSource.next(false);
    return Observable.throw(error);
  }

  extractData(res: Response) {
    let body = res.json();
    this.requestPendingSource.next(false);
    return body || {};
  }

}
