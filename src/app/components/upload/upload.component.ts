import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  selectedPictures: Array<any> = [];

  constructor(private toastService: ToastService,
              private validateService: ValidateService) {
  }

  ngOnInit() {
  }


  onPictureSelectorChange(ev) {
    this.selectedPictures = [];
    const files: Array<File> = ev.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      console.log(file);
      const validator = this.validateService.validatePostPicture(file);
      if (!validator.isValid) {
        this.toastService.toast(`${file.name} is too large. 15mb max.`);
        continue;
      }
      let fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        this.selectedPictures.push({
          file: file,
          encoded: fileReader.result
        });
      };
      fileReader.onerror = (error) => {
        console.log(error);
        this.toastService.toast('Error reading pictures');
      };
    }
  }

}
