import { Component, Input, OnInit } from '@angular/core';
import { StaticDataService } from "../../services/static-data.service";
import { PicturesService } from "../../services/pictures.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-upload-picture-form',
  templateUrl: './upload-picture-form.component.html',
  styleUrls: ['./upload-picture-form.component.css']
})
export class UploadPictureFormComponent implements OnInit {

  @Input() picture;

  dronesArray = this.staticData.dronesArray;
  dronesSelector;
  caption;
  tags;

  constructor(private staticData: StaticDataService,
              private picturesService: PicturesService,
              private toastService: ToastService) {
  }

  ngOnInit() {
  }


  onUploadBtnClick(pictureForm) {
    let uploadFormData: FormData = new FormData();
    let dataToSend: Object = {};
    if (this.dronesSelector) dataToSend["droneTaken"] = this.dronesArray[this.dronesSelector];
    if (this.caption) dataToSend["caption"] = this.caption;
    if (this.tags) {
      let tagsArray = this.tags.split(' ').filter((x) => x !== '' && x.startsWith('#') && x.length > 3).map((x) => x.toLowerCase());
      if (tagsArray.length) dataToSend["tags"] = tagsArray;
    }

    uploadFormData.append('pictureFile', this.picture.file);
    uploadFormData.append('data', JSON.stringify(dataToSend));

    this.picturesService.uploadPicture(uploadFormData).subscribe((data) => {
      if (data.success) {
        this.toastService.successToast('Picture Uploaded.');
        pictureForm.remove();
        console.log(data);
      } else {
        this.toastService.errorToast('An error occured: ' + (data.msg ? data.msg : "Unknown"));
      }
    }, (err) => {
      /*TODO This shit didn't work. Probably something with bug when the server actually returns string.*/
      console.log(err);
      this.toastService.errorToast(err.statusText);
    })
  }

}
