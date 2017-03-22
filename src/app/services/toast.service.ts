import { Injectable } from '@angular/core';

declare var Materialize: any;

@Injectable()
export class ToastService {

  constructor() {
  }

  toast(text: string) {
    Materialize.toast(text, 3000);
  }

  warningToast(text: string) {
    Materialize.toast(text, 3000, 'yellow lighten-1');
  }

  successToast(text: string) {
    Materialize.toast(text, 3000, 'green lighten-1');
  }

  errorToast(text: string) {
    Materialize.toast(text, 3000, 'red lighten-1');
  }
}
