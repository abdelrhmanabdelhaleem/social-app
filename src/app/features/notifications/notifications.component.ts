import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../core/auth/service/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  // Injecting NotificationsService to handle API requests
  private readonly _NotificationsService = inject(NotificationsService);

  allNotifications: any[] = []; // Holds all fetched notifications from API
  displayedNotifications: any[] = []; // Holds filtered notifications based on active tab
  unreadCount: number = 0; // Total unread notifications count
  isLoading: boolean = false; // Loading state flag
  currentFilter: 'all' | 'unread' = 'all'; // Active tab filter state

  ngOnInit(): void {
    this.fetchNotifications();
    this.fetchUnreadCount();
  }

  /**
   * Switch between All and Unread tabs and apply local filtering
   */
  setFilter(filter: 'all' | 'unread'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  /**
   * Fetch all notifications from the backend API
   */
  fetchNotifications(): void {
    this.isLoading = true;

    // Fetch all notifications with default limit
    this._NotificationsService.getNotifications(false, 1, 50).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.allNotifications = res.data?.notifications || res.notifications || [];
        this.applyFilter();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching notifications:', err);
      },
    });
  }

  /**
   * Filter notifications locally based on the selected tab (All or Unread)
   */
  applyFilter(): void {
    if (this.currentFilter === 'unread') {
      // Filter items where isRead is falsy (not read yet)
      this.displayedNotifications = this.allNotifications.filter((n) => !n.isRead);
    } else {
      // Show all notifications
      this.displayedNotifications = [...this.allNotifications];
    }
  }

  /**
   * Fetch the count of unread notifications from the API
   */
  fetchUnreadCount(): void {
    this._NotificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.data?.unreadCount || res.unreadCount || 0;
      },
      error: (err) => {
        console.error('Error fetching unread count:', err);
      },
    });
  }

  /**
   * Mark a single notification as read by its ID
   */
  onMarkAsRead(notificationId: string): void {
    this._NotificationsService.markAsRead(notificationId).subscribe({
      next: (res) => {
        // Update local state for the specific notification
        const target = this.allNotifications.find((n) => (n._id || n.id) === notificationId);
        if (target) {
          target.isRead = true;
        }
        this.applyFilter();
        this.fetchUnreadCount();
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      },
    });
  }

  /**
   * Mark all notifications as read in bulk
   */
  onMarkAllAsRead(): void {
    this._NotificationsService.markAllAsRead().subscribe({
      next: (res) => {
        // Update all local notifications as read
        this.allNotifications.forEach((n) => (n.isRead = true));
        this.applyFilter();
        this.unreadCount = 0;
      },
      error: (err) => {
        console.error('Error marking all as read:', err);
      },
    });
  }
}
