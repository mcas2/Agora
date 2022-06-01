import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public identity: any;
  public token: any;

  constructor(private _userSercice: UserService, private _router: Router, private _route: ActivatedRoute) {
    this.page_title = 'Identificate';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER');
    this.status = '';
  }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    this._userSercice.signUp(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          //Guardamos el usuario en una propiedad
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

          this._userSercice.signUp(this.user, true).subscribe(
            response => {
              if (response.token) {
                this.token = response.token;
                localStorage.setItem('token', this.token);

                this.status = 'success';
                this._router.navigate(['/inicio']);

              } else {
                this.status = 'error';
              }
            },
            error => {
              this.status = 'error';
              console.log(error);
            }
          );

        } else {
          this.status = 'error';
        }
        form.reset();
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
