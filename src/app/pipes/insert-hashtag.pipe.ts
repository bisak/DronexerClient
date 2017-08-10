import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'insertHashtag'
})
export class InsertHashtagPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return `#${value}`;
  }

}
