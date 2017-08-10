import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { MetadataService } from './../../services/metadata.service';
import { PostsService } from './../../services/posts.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-single-post-view',
  templateUrl: './single-post-view.component.html',
  styleUrls: ['./single-post-view.component.css']
})
export class SinglePostViewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  postId: string;
  post: object;
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    attributionControl: false,
    zoomControl: false,
    zoom: 12,
    center: L.latLng({ lat: 0, lng: 0 })
  };
  pictureLocaton;
  layers;
  hasMetadata = false;
  hasLocationMetadata = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private postsService: PostsService,
              private metadataService: MetadataService) {
  }

  ngOnInit() {
    this.listenForUrlChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  listenForUrlChanges() {
    this.subscriptions.push(this.route.params.subscribe((params: Params) => {
      this.postId = params['id'];
      this.getSinglePost();
    }));
  }

  getSinglePost() {
    this.subscriptions.push(this.postsService.getPost(this.postId).subscribe((response) => {
      this.post = response.data;
      console.log(this.post);
      const metadata = this.post['metadata'];

      this.hasMetadata = this.metadataService.hasMetadata(metadata);
      this.hasLocationMetadata = this.metadataService.hasLocationMetadata(metadata);
      if (this.hasLocationMetadata) {
        this.pictureLocaton = L.latLng({ lat: metadata.lat, lng: metadata.lng });
        this.options.center = this.pictureLocaton;

        const icon = L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: '/assets/marker-icon.png',
          shadowUrl: '/assets/marker-shadow.png'
        });
        const marker = L.marker(this.pictureLocaton, { icon: icon });

        this.layers = [marker];
      }
    }, (error) => {
      console.log(error);
    }));
  }

}
