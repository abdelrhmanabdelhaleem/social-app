import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const token = localStorage.getItem('userToken');

  if (!token) {
    return true; // Allow access if token does not exist
  } else {
    return _Router.parseUrl('/feed');
  }
};
