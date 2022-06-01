import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class NoIdentityGuard implements CanActivate {
    constructor(private _userService: UserService, private _router: Router) {

    }

    canActivate() {
        let identity = this._userService.getIdentity();

        if (identity && identity.name) {
            this._router.navigate(['/inicio']);
            return false;
        } else {
            return true;
        }
    }
}