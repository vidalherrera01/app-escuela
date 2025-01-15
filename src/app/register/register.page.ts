import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonGrid, IonCol, IonRow, IonSelectOption, IonSelect, IonInput } from '@ionic/angular/standalone';
import { DataUserService } from '../services/data-user.service';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonSelectOption, IonSelect, IonInput, IonGrid, RouterModule, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterComponent]
})
export class RegisterPage implements OnInit {

  name_student: string = ""
  mother: string = ""
  father: string = ""
  tel: string = ""
  phone: string = ""
  allergies_or_illness: string = ""

  date_day: any;
  date_month: any;
  date_year: any;

  profile: File | undefined;
  profilePhoto: string | undefined;
  signature: File | undefined;
  signaturePhoto: string | undefined;
  sl_name_student: string = ""


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


  async ft_photo_profile() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.profilePhoto = image.dataUrl
    const blob = await fetch(image.dataUrl!).then((res) => res.blob());
    this.profile = new File([blob], "profile.png", { type: blob.type });

  }

  async ft_photo_signature() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.signaturePhoto = image.dataUrl
    const blob = await fetch(image.dataUrl!).then((res) => res.blob());
    this.signature = new File([blob], "signature.jpg", { type: blob.type });

  }

  async ft_register() {
    if (this.dataUser.id_partner == "" || this.dataUser.id_partner == undefined) {
      this.router.navigate(['/login']);
      alert("se perdio la coneccion a internet")
      return
    }

    let obj_veryfy_empty: object = {
      nombre: this.name_student,
      madre: this.mother,
      padre: this.father,
      telefono: this.tel,
      celular: this.phone,
    }

    console.log(this.date_day, this.date_month, this.date_year)

    for (const [key, value] of Object.entries(obj_veryfy_empty)) {
      if (value == "") {
        alert(`el campo *** ${key} *** esta vacio`)
        return
      }
    }

    if (this.date_month == "" || this.date_day == "" || this.date_year == "") {
      alert("El campo ** Fecha** esta incompleto")
      return
    }

    if (this.date_month == undefined || this.date_day == undefined || this.date_year == undefined) {
      alert("El campo ** Fecha** esta incompleto")
      return
    }

    let urlRegister: string = `https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/student`
    // console.log(this.dataUser.id_partner)

    let birth_date = new Date(`${this.date_day}-${this.date_month}-${this.date_year}`).getTime().toString()

    const formData = new FormData();

    if (this.profile) {
      formData.append('profile', this.profile);
    }

    if (this.signature) {
      formData.append('signature', this.signature);
    }

    if (this.allergies_or_illness.trim() == "") {
      this.allergies_or_illness = "ninguna"
    }

    formData.append('name', this.name_student);
    formData.append('father_name', this.mother);
    formData.append('mother_name', this.father);
    formData.append('mother_name', this.father);
    formData.append('allergies_or_illness', this.allergies_or_illness);
    formData.append('birth_date_timestamp', birth_date);

    await fetch(urlRegister, {
      method: 'POST',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
      },
      body: formData

    })
      .then(response => response.json())
      .then(res => {
        // console.log(res.data.student, "desde resgister")

        if (res.data.student !== null) {
          this.ft_get_courses()
          this.ft_father_info()
        }
      })
    // .catch(error => console.error('Error:', error));
  }


  async ft_father_info() {
    // console.log(this.dataUser.id_partner)
    let urlFather_info: string = ` https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/info`

    const response = await fetch(urlFather_info,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.dataUser.token_user}`,
          'Content-Type': 'application/json',
        }
      }
    );
    const data = await response.json();
    this.dataUser.arr_students = data.data.students
    let last: number = this.dataUser.arr_students.length - 1
    this.dataUser.sl_students = this.dataUser.arr_students[last].name

    this.name_student = ""
    this.mother = ""
    this.father = ""
    this.tel = ""
    this.phone = ""
    this.profile = undefined
    this.profilePhoto = ""
    this.signature = undefined
    this.signaturePhoto = ""
    this.date_day = "";
    this.date_month = "";
    this.date_year = "";

    this.router.navigate(['/class']);
  }

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.ft_father_info()
    if (this.dataUser.id_partner == "" || this.dataUser.id_partner == undefined) {
      this.router.navigate(['/login']);
    }
  }
}
