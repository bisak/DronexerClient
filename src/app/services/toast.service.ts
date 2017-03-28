import { Injectable } from '@angular/core';

declare var Materialize: any;

@Injectable()
export class ToastService {

  constructor() {
  }

  toast(text: string, cb?) {
    Materialize.toast(text, 2000, '', cb);
  }

  warningToast(text: string, cb?) {
    Materialize.toast(text, 2000, 'yellow lighten-1', cb);
  }

  successToast(text: string, cb?) {
    Materialize.toast(text, 2000, 'green lighten-1', cb);
  }

  errorToast(text: string, cb?) {
    Materialize.toast(text, 2000, 'red lighten-1', cb);
  }
}
