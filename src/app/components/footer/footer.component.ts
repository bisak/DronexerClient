import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var Materialize;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  year = new Date().getFullYear()

}
