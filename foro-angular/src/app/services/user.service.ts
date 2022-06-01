import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { global } from "./global";

@Injectable()
export class UserService {
    public url: String;
    public identity: any;
    public token: any;

    constructor(private _http: HttpClient) {
        this.url = global.url;
    }

    prueba() {
        return 'Hola mundo desde el servicio e angular';
    }

    register(user: any): Observable<any> {
        //Convertir el objeto del usuario a un JSON string
        let params = JSON.stringify(user);

        //Definir las cabeceras
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        //Hacer peticion ajax
        return this._http.post(this.url + 'register', params, { headers: headers });
    }


    signUp(user: any, gettoken: boolean = false): Observable<any> {
        if (!!gettoken) {
            user.gettoken = 'true';
        }
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, { headers: headers });
    }

    getIdentity() {
        let identity: string | null = localStorage.getItem('identity');
        if (identity != null) {
            identity = JSON.parse(identity);
        }

        if (identity && identity != 'undefined' && identity != undefined && identity != null) {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = (localStorage.getItem('token'));

        if (token && token != 'undefined' && token != undefined && token != null) {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

    update(user: any): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this._http.put(this.url + 'user/update', params, { headers: headers });
    }

    getUsers(): Observable<any> {
        return this._http.get(this.url + 'users');
    }

    getUser(userId: any): Observable<any> {
        return this._http.get(this.url + 'user/' + userId);
    }
}