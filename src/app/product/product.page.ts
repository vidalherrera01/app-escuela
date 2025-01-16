import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonGrid, IonCol, IonRow, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCard, IonHeader, IonToolbar, IonTitle, IonAvatar, IonAlert } from '@ionic/angular/standalone';
import { DataUserService } from '../services/data-user.service';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonAlert, IonAvatar, IonTitle, IonToolbar, IonHeader, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLabel, IonRow, IonCol, IonGrid, IonButton, RouterModule, IonContent, CommonModule, FormsModule, FooterComponent]
})
export class ProductPage implements OnInit {

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  public alertButtons(id: number) {
    return [{
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('confirmado', id)
        this.ft_addProduct(id)
        console.log('agregado al carrito')
      },
    }
    ]
  }


  ft_loadStudent() {
    let last = this.dataUser.arr_students.length - 1

    if (this.dataUser.sl_students == '') {
      console.log(this.dataUser.arr_students[last].invoices)
      this.dataUser.sl_students = this.dataUser.arr_students[last].name
      this.dataUser.id_students = this.dataUser.arr_students[last].id
      this.dataUser.avatar_image = this.dataUser.arr_students[last].image
    }

    for (const item of this.dataUser.arr_students) {
      if (item.name == this.dataUser.sl_students) {
        this.dataUser.sl_students = item.name
        this.dataUser.id_students = item.id
        this.dataUser.avatar_image = item.image
      }

    }
    console.log(this.dataUser.arr_students[last].invoices)
    this.ft_get_courses()
  }

  ft_get_courses() {
    const urlCourses: string = `https://kabaygroup.com/api/school/student/${this.dataUser.id_students}/courses`

    fetch(urlCourses, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        // console.log(res.data)
        console.log(res.data.courses)
        this.dataUser.arr_courses = res.data.courses
      })
      .catch(error => console.error('Error:', error));
  }

  ft_get_product() {
    const urlProduct: string = `https://kabaygroup.com/api/school/student/${this.dataUser.id_students}/course/${this.dataUser.id_coursers}/products`
    console.log(this.dataUser.id_coursers)

    fetch(urlProduct, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.data.product_tmpls)
        this.dataUser.arr_products = res.data.product_tmpls
      })
      .catch(error => console.error('Error:', error));
  }

  ft_addProduct(idProduct: number) {
    this.dataUser.id_coursers = idProduct
    console.log(idProduct)

    const urlProduct = `https://kabaygroup.com/api/school/student/${this.dataUser.id_students}/product`

    fetch(urlProduct, {
      method: 'POST',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "params": {
          "product_tmpl_id": this.dataUser.id_coursers
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        // arr unique
        this.ft_father_info()
        console.log(data.result, " unique")
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
        console.log(this.dataUser.arr_students)
      })
      .catch(error => console.error('Error:', error));
  }

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ft_loadStudent()
    this.ft_get_product()
  }

}
