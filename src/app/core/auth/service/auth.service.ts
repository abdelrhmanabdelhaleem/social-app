import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISigninRequest, ISignupRequest, ISignupResponse } from '../../models/iauth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'https://route-posts.routemisr.com';

  // Handle user signup request
  signup(userData: ISignupRequest): Observable<ISignupResponse> {
    return this._HttpClient.post<ISignupResponse>(`${this.baseUrl}/users/signup`, userData);
  }

  // Handle user signin request
  signin(userData: ISigninRequest): Observable<ISignupResponse> {
    return this._HttpClient.post<ISignupResponse>(`${this.baseUrl}/users/signin`, userData);
  }
}
