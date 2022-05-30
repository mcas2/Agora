import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public identity: any;
  public token: any;

  constructor(private _http: HttpClient) {
    this.url = global.url;
   }

  register(user:any): Observable<any>{
    let params = JSON.stringify(user);

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'register', params, {headers:headers});
  }

  signup(user:any, gettoken: boolean = false): Observable<any> {
    if(gettoken){
      user.gettoken = true;
    }

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'login', params, {headers:headers})
  }

  getIdentity(){
    let identity: string |null = localStorage.getItem('identity');
    if (identity != null) {
      identity = JSON.parse(identity);
    }

    if (identity && identity != null && identity != undefined && identity != "undefined"){
      this.identity = identity;
    } else{
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');

    if (token && token != null && token != undefined && token != "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }

    return this.token;
  }

  update(user: any): Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.put(this.url+'update', params, {headers:headers});
  }
}

