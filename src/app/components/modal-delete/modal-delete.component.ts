import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {

  @Input() deleteModal
  @Output() deleteConfirmed = new EventEmitter<boolean>()
  @Output() deleteCancelled = new EventEmitter<boolean>()

  constructor() {
  }

  ngOnInit() {
  }

  cancelDelete() {
    this.deleteCancelled.emit(true)
  }

  confirmDelete() {
    this.deleteConfirmed.emit(true)
  }

}
