import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metadata-table',
  templateUrl: './metadata-table.component.html',
  styleUrls: ['./metadata-table.component.scss']
})
export class MetadataTableComponent implements OnInit {

  @Input() metadata;

  constructor() {
  }

  ngOnInit() {
  }

}
