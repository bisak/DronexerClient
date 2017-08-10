import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { PicturesService } from '../../services/pictures.service';
import { Router } from '@angular/router';
import { StaticDataService } from '../../services/static-data.service';
import { AuthHelperService } from '../../utilities/auth-helper.service';
import { MaterializeDirective } from 'angular2-materialize';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  selectedPictures: Array<any> = [];

  constructor(private toastService: ToastService,
              private authHelperService: AuthHelperService,
              private router: Router) {
  }

  ngOnInit() {
  }


  onPictureSelectorChange(ev) {
    this.selectedPictures = [];
    let files: Array<File> = ev.target.files;
    for (let i = 0; i < files.length; i++) {
      let file: File = files[i];
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
