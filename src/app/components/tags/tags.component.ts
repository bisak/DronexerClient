import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  urlTag: string;
  tagPosts: Array<Object> = [];
  lastPostTime: number;
  isListening: boolean = true;


  constructor(private picturesService: PicturesService,
              private toastService: ToastService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.listenForUrlChanges();
  }

  getTagPosts() {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }
    this.picturesService.getTagPosts(this.urlTag, time).subscribe((response) => {
      if (response.success) {
        let picData = response.data;
        this.tagPosts.push(...picData);
        this.lastPostTime = new Date(picData[picData.length - 1].createdAt).getTime();
        this.isListening = true;
      } else {
        this.isListening = false;
      }
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        return this.toastService.toast("No more posts available");
      }
      this.toastService.errorToast("Error getting user pictures.");
      this.isListening = false;
    })
  }

  onExploreScrolled() {
    if (this.isListening) {
      this.getTagPosts();
    }
  }

  listenForUrlChanges() {
    this.route.params.subscribe((params: Params) => {
      this.urlTag = params['tag'];

      this.tagPosts = []
      this.isListening = true;
      this.lastPostTime = null;

      this.getTagPosts();
    })
  }
}
