import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService} from '@auth0/angular-jwt';
import { AuthenticatedResponse } from "src/app/interfaces/AuthenticatedResponse";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private router:Router, 
              private jwtHelper: JwtHelperService, 
              private http: HttpClient){
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      const token = localStorage.getItem("jwt") || '{} ';
      if (token && !this.jwtHelper.isTokenExpired(token)){
          console.log(this.jwtHelper.decodeToken(token))
          return true;
      }

      const isRefreshSuccess = await this.tryRefreshingTokens(token); 
      if (!isRefreshSuccess) { 
      this.router.navigate(["login"]); 
      }

      return isRefreshSuccess;
  }

  private intervalId: any;

  async startTokenRefresh() {
    const refreshInterval = 300000; // 5 minutes
    const token = localStorage.getItem("jwt") || '{}';
    
    this.intervalId = setInterval(() => {
      this.tryRefreshingTokens(token)
        .then(isRefreshSuccess => {
          if (!isRefreshSuccess) {
            this.router.navigate(["login"]);
          }
        });
    }, refreshInterval);
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!token || !refreshToken) { 
        return false;
      } 
      
      const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
      let isRefreshSuccess: boolean;
      const refreshRes = await new Promise<AuthenticatedResponse>((resolve, reject) => {
        this.http.post<AuthenticatedResponse>("https://localhost:7003/api/Token/refresh", credentials, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (res: AuthenticatedResponse) => resolve(res),
          error: (_) => { reject; isRefreshSuccess = false;}
        });
      });
      localStorage.setItem("jwt", refreshRes.token);
      localStorage.setItem("refreshToken", refreshRes.refreshToken);
      isRefreshSuccess = true;
      return isRefreshSuccess;
  }
}