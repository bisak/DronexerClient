import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  isVisible: boolean

  constructor(private apiService: ApiService) {
    apiService.requestAnnounced.subscribe(data => {
      this.isVisible = data
    })
  }

  ngOnInit() {
  }

}
