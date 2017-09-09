import { Component, OnInit, isDevMode } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  isVisible: boolean;

  constructor(private apiService: ApiService) {
    if (isDevMode()) {
      apiService.requestAnnounced.subscribe(data => {
        this.isVisible = data;
      });
    }
  }
}
