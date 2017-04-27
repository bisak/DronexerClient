import { Component, Input, OnInit } from '@angular/core';
import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {

  @Input() deleteModal

  constructor(public postComponent: PostComponent) { }

  ngOnInit() {
  }

}
