import { Route, Router, Routes } from '@angular/router';
import { FireService } from '../providers/fire.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fireService: FireService;
  fireUser: firebase.User;
  router: Router;
  user = {
    mail: '',
    password: '',
    confirm: ''
  };
  error = {
    code: '',
    message: ''
  } ;
  constructor(fireService: FireService, router: Router) {
    this.fireService = fireService;
    this.router = router;
  }

  ngOnInit() {}

  createUserByMail(user) {
    this.error.message = '';
    if (user.confirm === user.password) {
      this.fireService.createUserByMail(user.mail, user.password)
      .then(res => {
         this.fireService.sendEmailVerification()
         .then(result => {
           this.fireService.createUser(this.fireService.fireUser)
           .then( r => this.router.navigate(['']));
         });
      })
      .catch(err => this.error.message = err.message);

    } else {
      this.error.message = 'Passwords must be equals';
    }
  }
}
