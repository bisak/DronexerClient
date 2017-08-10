import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'unixToDate'
})
export class UnixToDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(moment.unix(value)).format('Do MMMM YYYY')
  }

}
