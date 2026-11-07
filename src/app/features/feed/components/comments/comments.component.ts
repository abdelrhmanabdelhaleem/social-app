import { Component, Input, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService } from '../../../../core/auth/service/comments.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() postId!: string;
  @Input() commentsCount: number = 0;
  @Input() externalToggle: boolean = false; // Receives external toggle state from PostCardComponent when clicking the Comment button

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _CommentsService = inject(CommentsService);

  commentForm: FormGroup = this._FormBuilder.group({
    content: ['', [Validators.required]],
  });

  commentsList: any[] = [];
  isLoadingComments: boolean = false;
  isSubmitting: boolean = false;
  showCommentsSection: boolean = false;

  currentUserName: string = 'User';
  currentUserPhoto: string =
    'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png';

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.loadUserData();
    this.fetchComments(); // Fetch comments initially to check for Top Comment
  }

  // Listen to external toggle changes when clicking the main Comment button in PostCard
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalToggle'] && !changes['externalToggle'].firstChange) {
      this.showCommentsSection = this.externalToggle;
      if (this.showCommentsSection && this.commentsList.length === 0) {
        this.fetchComments();
      }
    }
  }

  loadUserData(): void {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserName = user.name || 'User';
        this.currentUserPhoto = user.photo || this.currentUserPhoto;
      } catch (e) {
        console.error('Error parsing userInfo', e);
      }
    }
  }

  // Toggle comments section manually (e.g., clicking "View all comments")
  toggleCommentsSection(): void {
    this.showCommentsSection = !this.showCommentsSection;
    if (this.showCommentsSection && this.commentsList.length === 0) {
      this.fetchComments();
    }
  }

  // Fetch comments matching {{baseUrl}}/posts/{{postId}}/comments?page=1&limit=10
  fetchComments(): void {
    this.isLoadingComments = true;
    this._CommentsService.getPostComments(this.postId, 1, 10).subscribe({
      next: (res) => {
        this.isLoadingComments = false;
        this.commentsList = res.data?.comments || res.comments || [];
      },
      error: (err) => {
        this.isLoadingComments = false;
        console.error('Error fetching comments:', err);
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  // Create comment matching {{baseUrl}}/posts/{{postId}}/comments
  onSubmitComment(): void {
    if (this.commentForm.invalid && !this.selectedImage) return;

    const formData = new FormData();
    formData.append('content', this.commentForm.get('content')?.value || '');
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.isSubmitting = true;
    this._CommentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.commentForm.reset();
        this.removeImage();
        this.commentsCount++;
        this.fetchComments(); // Refresh comments list
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating comment:', err);
      },
    });
  }
}
