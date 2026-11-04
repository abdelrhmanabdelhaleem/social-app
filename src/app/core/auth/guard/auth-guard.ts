import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const token = localStorage.getItem('userToken');

  if (token) {
    return true; // Allow access if token exists
  } else {
    return _Router.parseUrl('/login');
  }
};
