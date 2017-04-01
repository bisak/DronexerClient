import { Injectable } from '@angular/core';

@Injectable()
export class DatesService {
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor() {
  }

  getFormattedDateString(date: string) {
    let t = new Date(date);
    return `${t.getDate()} ${this.monthNames[t.getMonth()]} ${t.getFullYear()}` //24 March, 2017 <- format
  }

}
