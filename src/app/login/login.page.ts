import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonTitle, IonCheckbox, IonItem, IonButton, IonInput, IonText, IonImg } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { DataUserService } from '../services/data-user.service';

interface User {
  email: string,
  pass: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonImg, RouterModule, IonText, IonCheckbox, IonInput, IonButton, IonItem, IonContent, IonTitle, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {

  ft_register() {
    this.bl_register = !this.bl_register
  }

  bl_checkbox: boolean = false;
  false_checkbox: boolean = false;

  isCheck() {

    let user: User = {
      email: this.email,
      pass: this.password
    }

    if (this.bl_checkbox) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('check', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('check', 'false');
    }

  }

  loadLocal() {
    let lc_check = localStorage.getItem('check') as string;
    let lc_user = localStorage.getItem('user') as string;
    this.bl_checkbox = JSON.parse(lc_check);

    if (lc_check == null) {
      this.false_checkbox = false;
      this.bl_checkbox = false;
      localStorage.setItem('check', 'false');
      console.log(this.false_checkbox);
    } else {
      this.false_checkbox = JSON.parse(lc_check);
      console.log("falsecheck ", this.false_checkbox)
    }

    if (lc_user != null) {
      let var_user: User = JSON.parse(lc_user);

      this.email = var_user.email;
      this.password = var_user.pass;
      if (this.bl_checkbox) this.ft_login();
    }
  }

  email: string = ""
  password: string = ""
  name_father: string = ""
  phone: string = ""
  bl_register: boolean = false;

  ft_login() {
    let urlLogin: string = "https://kabaygroup.com/api/authenticate"

    fetch(urlLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "params": {
            "login": this.email,
            "password": this.password
          }
        }
      )
    })
      .then(response => response.json())
      .then(data => {
        if (data.result !== null) {
          this.dataUser.token_user = data.result.token
          this.dataUser.id_partner = data.result.userInfo.partner_id
          console.log(this.dataUser.id_partner)
          this.ft_father_info()

        } else {
          alert("usuario o clave errornea")
        }

      })
      .catch(error => console.error('Error:', error));
  }

  n_name: string = "";
  n_email: string = "";
  n_password: string = "";
  n_phone: string = "";

  ft_signup() {
    if (this.n_email.trim() == "" || this.n_password.trim() == "" || this.n_phone.trim() == "" || this.n_name.trim() == "") {
      alert("Hay Campos Vacios, Favor Llenar")
      return
    }

    let urlSignUp: string = "https://kabaygroup.com/api/signup"

    fetch(urlSignUp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "params": {
          "login": this.n_email,
          "company_id": 9,
          "password": this.n_password,
          "name": this.n_name,
          "mobile": "000-000-0000",
          "phone": this.n_phone
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.result !== null) {
          this.email = this.n_email
          this.password = this.n_password
          this.ft_login()
        } else {
          alert("Este usuario esta en uso, favor cambiarlo")
        }
      })
      .catch(error => console.error('Error:', error));
  }

  ft_father_info() {
    let urlFather_info: string = ` https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/info`

    fetch(urlFather_info, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.data)
        this.dataUser.arr_students = res.data.students
        this.dataUser.sl_students = ""

        if (this.dataUser.arr_students.length < 1) {
          this.router.navigate(['/incribite']);
        } else {
          this.router.navigate(['/class']);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  constructor(
    private dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.email = "papa5"
    // this.password = "123"
    // this.ft_login()

    this.loadLocal()
  }
}
