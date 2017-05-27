import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-single-post-view',
  templateUrl: './single-post-view.component.html',
  styleUrls: ['./single-post-view.component.css']
})
export class SinglePostViewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  postId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit () {
    this.listenForUrlChanges();
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  listenForUrlChanges () {
    this.subscriptions.push(this.route.params.subscribe((params: Params) => {
      this.postId = params['id'];
      console.log(this.postId);
    }))
  }

}
