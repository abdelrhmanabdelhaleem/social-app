import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../../core/auth/service/posts.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _PostsService = inject(PostsService);

  // Output event to notify parent (FeedComponent) to refresh posts list
  @Output() postCreated = new EventEmitter<void>();

  postForm: FormGroup = this._FormBuilder.group({
    body: ['', [Validators.required]],
  });

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading: boolean = false;

  // Trigger hidden file input click
  triggerFileUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  // 1. Event change select file and save in variable, show using FileReader
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // 2. Show file in HTML using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image preview
  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  // 3. Form control and submit form and call API using FormData()
  onSubmit(): void {
    if (this.postForm.invalid && !this.selectedImage) return;

    const formData = new FormData();
    formData.append('body', this.postForm.get('body')?.value || '');

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.isLoading = true;

    this._PostsService.createPost(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Post created successfully:', response);

        // 4. Reset form & image variables
        this.postForm.reset();
        this.removeImage();

        // 5. Call all posts to update feed
        this.postCreated.emit();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating post:', err);
      },
    });
  }
}
