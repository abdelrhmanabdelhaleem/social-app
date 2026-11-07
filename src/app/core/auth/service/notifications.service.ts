import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken') || ''}`,
      },
    };
  }

  // 1. Get Notifications with filtering (unread=true/false) and pagination
  getNotifications(unread: boolean = false, page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/notifications?unread=${unread}&page=${page}&limit=${limit}`,
      this.getHeaders(),
    );
  }

  // 2. Get Unread Count
  getUnreadCount(): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/notifications/unread-count`,
      this.getHeaders(),
    );
  }

  // 3. Mark Single Notification As Read
  markAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(
      `${environment.baseUrl}/notifications/${notificationId}/read`,
      {},
      this.getHeaders(),
    );
  }

  // 4. Mark All Notifications As Read
  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(
      `${environment.baseUrl}/notifications/read-all`,
      {},
      this.getHeaders(),
    );
  }
}
