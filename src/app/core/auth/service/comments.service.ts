import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  // Headers configuration matching Bearer Token format
  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken') || ''}`,
      },
    };
  }

  // 1. Get Comments for a specific post with pagination
  getPostComments(postId: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/posts/${postId}/comments?page=${page}&limit=${limit}`,
      this.getHeaders(),
    );
  }

  // 2. Create Comment for a specific post (supports text and image via FormData)
  createComment(postId: string, commentData: FormData): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/posts/${postId}/comments`,
      commentData,
      this.getHeaders(),
    );
  }
}
