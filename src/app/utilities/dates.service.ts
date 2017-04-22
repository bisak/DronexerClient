import { Injectable } from '@angular/core';

@Injectable()
export class DatesService {
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor() {
  }

  getFormattedDateString(inDate: any) {
    let time
    if (inDate instanceof Date) {
      time = inDate
    } else {
      time = new Date(inDate)
    }
    return `${time.getDate()} ${this.monthNames[time.getMonth()]} ${time.getFullYear()}` //24 March, 2017 <- format
  }

}
