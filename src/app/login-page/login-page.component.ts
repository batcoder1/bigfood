import { FireService } from './../providers/fire.service';
import { Router } from '@angular/router';

 import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent   {
   isLoggedIn: boolean;

   constructor(public fireService: FireService, private router: Router) {}
  login() {
    this.fireService.loginWithGoogle().then((data) => {
      // nos envia a la pagina home una vez logeados
      this.router.navigate(['']);
    });
  }
}
