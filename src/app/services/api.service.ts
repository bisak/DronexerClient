import { Injectable } from '@angular/core';
import { Headers, Http, Response } from "@angular/http"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  constructor() {
  }

  public apiUrl = "http://localhost:8080/api"

  /*TODO wrap the http module here.*/

  handleError(error: Response | any) {
    if (error instanceof Response) {
      return Observable.throw(error);
    }
  }

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

}
