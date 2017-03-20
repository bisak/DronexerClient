import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.css']
})
export class UploadPictureComponent implements OnInit {

  private uploader: FileUploader

  constructor() {
    this.uploader = new FileUploader({
      url: 'http://localhost:8080/api/pictures/upload',
      itemAlias: 'file',
      additionalParameter: {
        uploaderUsername: 'wtfman'
      }
    })
    this.uploader.onErrorItem = ((item: any, response: string, status: number, headers: any): any => {
      console.log(item)
      console.log(response)
      console.log(status)
      console.log(headers)
    });
  }

  ngOnInit() {
  }

}
