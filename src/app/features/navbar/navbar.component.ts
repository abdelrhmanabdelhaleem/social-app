import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly _AuthService = inject(AuthService);

  // Dropdown visibility state
  isDropdownOpen: boolean = false;

  // Toggle user profile dropdown
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown when an action is selected
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Handle user logout execution
  logout(): void {
    this.closeDropdown();
    this._AuthService.signout();
  }
}
