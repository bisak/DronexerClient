import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm-password',
  templateUrl: './modal-confirm-password.component.html',
  styleUrls: ['./modal-confirm-password.component.css']
})
export class ModalConfirmPasswordComponent implements OnInit {

  @Input() confirmModal
  @Output() confirm = new EventEmitter<any>()
  @Output() cancel = new EventEmitter<boolean>()

  oldPassword: any

  constructor() {
  }

  cancelEdit() {
    this.cancel.emit(true)
  }

  confirmEdit() {
    this.confirm.emit(this.oldPassword)
  }

  ngOnInit() {
    this.oldPassword = ""
  }

}
