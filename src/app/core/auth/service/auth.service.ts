import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISigninRequest, ISignupRequest, ISignupResponse } from '../../models/iauth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);

  // Handle user signup request
  signup(userData: ISignupRequest): Observable<ISignupResponse> {
    return this._HttpClient.post<ISignupResponse>(`${environment.baseUrl}/users/signup`, userData);
  }

  // Handle user signin request
  signin(userData: ISigninRequest): Observable<ISignupResponse> {
    return this._HttpClient.post<ISignupResponse>(`${environment.baseUrl}/users/signin`, userData);
  }
  // Handle user signout logic
  signout(): void {
    // 1. Remove stored authentication token
    localStorage.removeItem('userToken');

    // 2. Redirect to login using parseUrl
    this._Router.navigate(['/login']);
  }
}
