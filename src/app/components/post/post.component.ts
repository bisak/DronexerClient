import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { PostsService } from "../../services/posts.service";
import { MaterializeAction } from "angular2-materialize";
import { StaticDataService } from "../../services/static-data.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  @Output() onPostDeleted = new EventEmitter<any>();
  deleteModal = new EventEmitter<string | MaterializeAction>();
  editModal = new EventEmitter<string | MaterializeAction>();
  newComment: string;

  constructor(private toastService: ToastService,
              private picturesService: PicturesService,
              private authHelperService: AuthHelperService,
              private postsService: PostsService,
              private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.post.pictureUrl = this.postsService.getPictureUrlForPost(this.post);
    this.post.userPictureUrl = this.picturesService.getProfilePicUrl(this.post.username);
    this.post.userIsAuthenticatedToEdit = (this.post.userId === this.authHelperService.getUserIdFromToken());
    this.newComment = '';
  }

  openDeleteModal() {
    this.post.showDeleteModal = true;
    setTimeout(() => {
      this.deleteModal.emit({action: 'modal', params: ['open']});
    }, 200);
  }

  closeDeleteModal() {
    this.deleteModal.emit({action: "modal", params: ['close']});
  }

  openEditModal() {
    this.post.showEditModal = true;
    setTimeout(() => {
      this.editModal.emit({action: 'modal', params: ['open']});
    }, 200);
  }

  closeEditModal() {
    this.editModal.emit({action: "modal", params: ['close']});
  }

  commentPost() {
    if (!this.post.comments && this.post.commentsCount > 0) {
      this.loadComments();
    }
    const comment = this.newComment;
    const postId = this.post._id;
    if (comment.length) {
      this.postsService.commentPost(postId, {comment}).subscribe((data) => {
        if (!this.post.comments)
          this.post.comments = [];
        let commentToAdd = {
          userId: this.authHelperService.getUserIdFromToken(),
          username: this.authHelperService.getUsernameFromToken(),
          comment: comment
        };
        this.post.comments.push(commentToAdd);
        this.post.commentsCount += 1;
        this.post.showComments = true;
      }, (error) => {
        if (error.status === 401) {
          this.toastService.warningToast("Log in to comment.");
        }
      });
      this.newComment = '';
    }
  }

  likePost() {
    const postId = this.post._id;
    this.postsService.likePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = true;
      this.post.likesCount += 1;
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to like.");
      }
      console.log(error);
    });
  }

  unLikePost() {
    const postId = this.post._id;
    this.postsService.unLikePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = false;
      this.post.likesCount -= 1;
    }, (error) => {
      console.log(error);
    });
  }

  deletePost() {
    const postId = this.post._id;
    this.postsService.deletePost(postId).subscribe((data) => {
      /*TODO maybe not emit that event and delete the post DOM element locally*/
      this.onPostDeleted.emit(this.post);
      this.closeDeleteModal();
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  editPost(editedData) {
    const postId = this.post._id;
    let editedDataToSend = {...editedData};
    delete editedDataToSend.newDroneSelector;
    editedDataToSend.newTags = editedDataToSend.newTags.split(' ').filter((x) => x !== '' && x.startsWith('#') && x.length > 3).map((x) => x.toLowerCase());
    this.postsService.editPost(postId, editedDataToSend).subscribe((response) => {
      if (response.success) {
        this.post.caption = editedDataToSend.newCaption;
        this.post.tags = editedDataToSend.newTags;
        this.post.droneTaken = editedDataToSend.newSelectedDroneName;
        this.closeEditModal();
      }
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to edit.");
      }
      console.log(error);
    });
  }

  postRateAction() {
    if (this.post.isLikedByCurrentUser) {
      this.unLikePost();
    } else {
      this.likePost();
    }
  }

  loadComments() {
    const postId = this.post._id;
    this.postsService.getComments(postId).subscribe((comments) => {
      if (comments.success) {
        this.post.comments = comments.data;
        this.post.showComments = true;
      }
    }, (error) => {
      console.log(error);
      this.toastService.toast("Couldn't load comments.");
    });
  }
}
