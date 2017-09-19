import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid = true;
  emailMessage;
  usernameValid= true;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
      this.createForm()
  }

  createForm() {
  	this.form = this.formBuilder.group({
  		email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
  		username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
         this.validateUsername
      ])],
  		password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.validatePassword
      ])],
  		confirm: ['', Validators.required]
  	}, { validator: this.matchingPasswords('password', 'confirm') } )
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)) {
      return null;
    }else {
      return { 'validateEmail': true }
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z\-0-9]+$/);
    if(regExp.test(controls.value)) {
      return null;
    }else {
      return { 'validateUsername': true }
    }

  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    if(regExp.test(controls.value)) {
      return null;
    }else {
      return { 'validatePassword': true }
    }

  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if(group.controls[password].value === group.controls[confirm].value) {
        return null
      } else {
        return { 'validateMatchingPassword': true }
      }
    }
  }
  
  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();

     const user = {
       email: this.form.get('email').value,
       username: this.form.get('username').value,
       password: this.form.get('password').value
     }

    this.authService.registerUser(user).subscribe(data => {
      console.log(data.message);
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.enableForm();
      }else{

        this.message = data.message;
        this.messageClass = 'alert alert-success';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
    

  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();

  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();

  }

  onCheckEmail() {

    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if(!data.success) {
        this.emailMessage = data.message;
        this.emailValid = false;
      } else {
        this.emailMessage = data.message;
        this.emailValid = true;

      }

    });
  }

  onCheckUsername() {

    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if(!data.success) {
        this.usernameMessage = data.message;
        this.usernameValid = false;
      } else {
        this.usernameMessage = data.message;
        this.usernameValid = true;
      }

    });
  }

  ngOnInit() {
  }

}
