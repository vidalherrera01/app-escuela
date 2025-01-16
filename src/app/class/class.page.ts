import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonAvatar, IonModal, IonTitle, IonButtons, IonItem, Platform, IonSpinner, IonLabel } from '@ionic/angular/standalone';
import { DataUserService } from '../services/data-user.service';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: true,
  imports: [IonLabel, IonSpinner, IonItem, IonButtons, IonTitle, IonModal, IonAvatar, IonText, IonCol, IonRow, IonGrid, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, RouterModule, IonContent, IonSelect, IonSelectOption, IonHeader, IonToolbar, CommonModule, FormsModule, FooterComponent]
})
export class ClassPage implements OnInit {

  ft_get_courses_item(item: any) {
    this.dataUser.arr_student_courses = item
  }

  isModalOpen: boolean = false;

  ft_goProducts(id: any) {
    this.dataUser.id_coursers = id;
    this.router.navigate(['/product']);
  }

  setOpen() {
    this.isModalOpen = !this.isModalOpen
  }

  closeSession() {
    this.router.navigate(['/login']);
  }

  ft_loadStudent() {

    for (const item of this.dataUser.arr_students) {
      if (item.name == this.dataUser.sl_students) {
        this.dataUser.sl_students = item.name
        this.dataUser.id_students = item.id
        this.dataUser.avatar_image = item.image
        this.dataUser.current_user = item

      }
    }

    if (this.dataUser.sl_students == '') {
      let last = this.dataUser.arr_students.length - 1

      this.dataUser.sl_students = this.dataUser.arr_students[last].name
      this.dataUser.id_students = this.dataUser.arr_students[last].id
      this.dataUser.avatar_image = this.dataUser.arr_students[last].image
      this.dataUser.current_user = this.dataUser.arr_students[last]
    }

    this.ft_get_courses()
  }


  async ft_get_courses() {
    const urlCourses: string = `https://kabaygroup.com/api/school/student/${this.dataUser.id_students}/courses`

    await fetch(urlCourses, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {

        this.dataUser.arr_courses = res.data.courses
      })
      .catch(error => console.error('Error:', error));
  }

  async ft_addCourse(idCourse: number) {
    this.dataUser.id_coursers = idCourse

    const urlCourseID = `https://kabaygroup.com/api/school/course/${idCourse}/subscribe`

    await fetch(urlCourseID, {
      method: 'POST',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "params": {
          "student_id": this.dataUser.id_students
        }
      })
    })
      .then(response => response.json())
      .then(res => {
        this.ft_get_courses()
        this.ft_father_info()
      })
      .catch(error => console.error('Error:', error));

  }

  async ft_father_info() {
    let urlFather_info: string = ` https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/info`

    await fetch(urlFather_info, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        this.dataUser.arr_students = res.data.students
        // console.log(this.dataUser.arr_students)
      })
      .catch(error => console.error('Error:', error));
  }

  onBackButtonPressed() {
    // Lógica personalizada cuando se presiona el botón atrás
    this.isModalOpen = false
  }

  constructor(
    private platform: Platform,
    public dataUser: DataUserService,
    private router: Router
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // console.log('Botón atrás presionado');
      // Aquí puedes manejar la acción personalizada
      this.onBackButtonPressed();
    });
  }

  ngOnInit() {
    console.clear()
    this.ft_loadStudent()
    console.log(
      this.dataUser.arr_students,
      this.dataUser.arr_courses
    )
  }

}
