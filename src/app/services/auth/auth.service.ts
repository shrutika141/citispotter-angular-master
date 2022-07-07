import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilityService } from '../utility/utility.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private http: HttpClient,
    private utilityService: UtilityService) { }

  url: string = this.utilityService.baseUrl;

  login(data): Observable<any> {
    let body  = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/login', body);
  }

  register(data): Observable<any> {
    console.log("before data");
    console.log(data);
    // let body = new FormData();
    // body.append('name', data.name);
    // body.append('email', data.email);
    // body.append('mobile', data.mobile ? data.mobile : null);
    // body.append('password', data.password ? data.password : null);
    // // body.append('role', data.role ? data.role : null);
    // body.append('country', data.country ? data.country : null);
    // body.append('google_id', data.google_id ? data.google_id : null);
    // body.append('facebook_id', data.facebook_id ? data.facebook_id : null);
    // body.append('social_login_type', data.social_login_type ? data.social_login_type : null);
    // body.append('referred_by', data.referred_by ? data.referred_by : null);
    // body.append('address', data.address ? data.address : null);

    let body = this.utilityService.convertObjectToFormData(data);
    console.log(body);
    return this.http.post(this.url + '/register', body);
  }

  registerThroughGoogle(data): Observable<any> {
    return this.http.post(this.url + '/register', data);
  }
}
