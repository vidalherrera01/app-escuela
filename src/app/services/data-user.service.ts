import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataUserService {

  constructor(
    private router: Router
  ) { }

  token_user: string = ""
  id_partner: string = ""
  id_students: string = ""
  sl_students: string = ""
  avatar_image: string = ""
  id_coursers: number | null = null
  arr_students: any[] = []
  arr_courses: any = []
  arr_products: any[] = []
  arr_student_courses: any = null
  current_user: any

  ft_back() {
    this.router.navigate(["/class"])
  }

  closeSession() {
    localStorage.removeItem('user')
    localStorage.setItem('check', 'false')

    this.router.navigate(['/login']);
  }

  ft_q(item: any) {
    console.log("datos", item)
  }


}
