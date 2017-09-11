import { FireService } from './../providers/fire.service';
import { Router } from '@angular/router';

 import { Component, OnInit } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 import { ErrorAuthFirebase } from 'app/utils/ErrorAuthFirebase';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent   {
   isLoggedIn: boolean;
   fireUser: firebase.User;
   user = { mail: ' ', password: ' '};
  mail = '';
  password = '';


   error= {code: '', message: ''} ;
   resp: any;
   constructor(
     public fireService: FireService,
     private router: Router) {
   }
  loginWithMail(mail, password) {
    this.fireService.loginWithMail(mail, password).then(res => {
      console.log('Login success');
      this.fireUser = res;
      localStorage.setItem('fireUser', JSON.stringify(this.fireUser));
      this.router.navigate(['']);
    }).catch(err => this.error.message = err.message);
  }

  loginWithGoogle() {
    this.fireService.loginWithGoogle().then((data) => {
      // nos envia a la pagina home una vez logueados
      this.router.navigate(['']);
    });
  }
  goToSignUp() {
    this.router.navigate(['signup']);
  }
  recoveryPass(mai) {
    console.log('TODO');
  }
}
