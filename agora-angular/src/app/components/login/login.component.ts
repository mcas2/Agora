import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})

export class LoginComponent implements OnInit {
  public page_title: string;
  public user:User;
  public status: string | undefined;
  public identity: any;
  public token: any;

  constructor(private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
    ) {
    this.page_title = 'Identifícate';
    this.user =  new User(
      '', '', '', '' ,'' ,'' ,'ROLE_USER'
      );  
    }

  ngOnInit(): void {
  }


  onSubmit(form:any){
    this._userService.signup(this.user).subscribe(
      response => {
        if (response.user && response.user._id){
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

          this._userService.signup(this.user, true).subscribe(
            response => {
              if (response.token){
                this.token = response.token;
                localStorage.setItem('token', this.token);

                this.status = 'success';
                this._router.navigate(['/home']);

              } else {
                this.status = 'error';
              }
            }
          )

        } else {
          this.status = 'error';
        }
      },

      error => {
        this.status = 'error';
        console.log(error);

      }
    )
  }
}
