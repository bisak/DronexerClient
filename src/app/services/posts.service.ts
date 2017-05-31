import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostsService {

  constructor(private apiService: ApiService) {
  }

  commentPost (id: string, data: any): Observable<any> {
    return this.apiService.post(`posts/comment/${id}`, data);
  }

  getComments (id: string): Observable<any> {
    return this.apiService.get(`posts/comments/${id}`);
  }

  likePost (id: string): Observable<any> {
    return this.apiService.post(`posts/like/${id}`, {});
  }

  unLikePost (id: string): Observable<any> {
    return this.apiService.post(`posts/unlike/${id}`, {});
  }

  editPost (id: string, data: any) {
    return this.apiService.post(`posts/edit/${id}`, data);
  }

  deletePost (id: string): Observable<any> {
    return this.apiService.delete(`posts/delete/${id}`);
  }

  getPictureUrlForPost (post: any): string {
    const fileLocation = post.fileLocation.join('/')
    return `${this.apiService.apiUrl}pictures/${fileLocation}/l/${post.fileName}`;
  }

  getPost (id: string): Observable<any> {
    return this.apiService.get(`posts/post/${id}`)
  }
}
