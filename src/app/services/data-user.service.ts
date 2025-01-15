import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataUserService {

  constructor() { }

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

}
