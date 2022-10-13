import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MD5 } from 'src/app/utils/md5';
import { UserLoginDto, LoginRequest, LoginResponse, LogoutResponse } from 'src/app/dto/auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
     // when deploying with proxy, check for production mode and add Prefix like /ContactBook (should be the path from the server proxy)
    return '/api/auth';
  }

  loggedIn: boolean;
  sessionToken: string | null;
  user: UserLoginDto | null;

  login(username: string, password: string): Observable<LoginResponse> {
    let request = new LoginRequest();
    request.username = username;
    request.password = MD5.Compute(password);

    return this.http.post<LoginResponse>(this.baseUrl + '/login', request).pipe(
      map((result) => {
        if(!result.isError) {
          this.sessionToken = result.sessionToken;
          this.user = result.user;
          this.loggedIn = true;
        }
        
        return result;
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    const headers = <any>{ 't': this.sessionToken };

    return this.http.post<LogoutResponse>(this.baseUrl + '/logout', null, { headers });
  }

  reset(): void {
    this.loggedIn = false;
    this.sessionToken = null;
    this.user = null;
  }

}