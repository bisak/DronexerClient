import {Component, OnInit} from '@angular/core';
import {PicturesService} from "../../services/pictures.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  explorePosts;
  lastPostTime;


  constructor(private picturesService: PicturesService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.getExplorePosts()
  }

  getExplorePosts() {
    let time = new Date().getTime()
    if(this.lastPostTime){
      time = this.lastPostTime
    }
    console.log(time)
    this.picturesService.getExplorePosts(time.toString()).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        this.explorePosts = retrievedPictures.data
        console.log(retrievedPictures)
      }
    }, (error) => {
      console.log(error)
      if (error.status === 404) {
        return false
      }
      this.toastService.errorToast("Error getting user pictures.")
    })
  }
}
