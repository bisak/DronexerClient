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
    //Materialize.toast(`<span class="red-text">WTF MAN</span>`, 3000)
  }

  private year = new Date().getFullYear()

}
