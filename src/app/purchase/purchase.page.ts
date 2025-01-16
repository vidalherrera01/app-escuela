import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonCol, IonRow, IonModal, IonButtons, IonImg, IonLabel, IonText, IonListHeader } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";
import { DataUserService } from '../services/data-user.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
  standalone: true,
  imports: [IonListHeader, IonText, IonLabel, IonItem, IonImg, IonButtons, IonModal, IonRow, IonCol, IonGrid, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonButton, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterComponent]
})

export class PurchasePage implements OnInit {

  profile: File | undefined;
  profilePhoto: string | undefined;
  arr_idVoucher: any[] = []
  file_watchVoucher: string = ""
  url_invoices: string | undefined = ""

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async ft_photoVouchers(id_voucher: number) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.profilePhoto = image.dataUrl
    const blob = await fetch(image.dataUrl!).then((res) => res.blob());
    this.profile = new File([blob], "voucher.png", { type: blob.type });

    console.log(id_voucher)

    if (this.ft_verify_idVoucher(id_voucher)) {
      return
    }

    this.ft_save_idVoucher(id_voucher)

    if (this.profile) {
      this.ft_addVouchers(id_voucher)
    }

    alert('foto enviada')
    this.profile = undefined
  }

  ft_verify_idVoucher(id: number): boolean {
    let state: boolean = false

    for (const item of this.arr_idVoucher) {
      if (id == item) {
        state = true
      }
    }

    return state
  }

  ft_save_idVoucher(id?: number) {

    if (localStorage.getItem('id_voucher')) {
      this.arr_idVoucher = JSON.parse(localStorage.getItem('id_voucher') || "")
    } else {
      localStorage.setItem("id_voucher", JSON.stringify(this.arr_idVoucher))
      return
    }

    if (id == null || id == undefined) {
      return
    } else {

      for (const item of this.arr_idVoucher) {
        if (item == id) {
          console.log(this.arr_idVoucher)
          return
        }
      }

      this.arr_idVoucher.push(id);
      localStorage.setItem("id_voucher", JSON.stringify(this.arr_idVoucher))
    }

    console.log(this.arr_idVoucher)
  }

  ft_addVouchers(id_voucher: any) {
    console.log(id_voucher)

    const urlVouchers = `https://kabaygroup.com/api/attachment/model/account.move/res_id/${id_voucher}/upload/`
    console.log(urlVouchers)

    const formData = new FormData();

    if (this.profile) {
      formData.append('attachment', this.profile)
    }

    console.log(formData, 'formdata')

    fetch(urlVouchers, {
      method: 'POST',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
      },
      body: formData
    })

      .then(response => response.json())
      .then(data => {
        // arr unique
        console.log(data)
      })
      .catch(error => console.error('Error:', error));
  }

  ft_seeVoucher(id_voucher: number, url?: string) {
    console.log(id_voucher)

    console.log(id_voucher)

    const urlVouchers = `https://kabaygroup.com/api/attachment/account.move/res_id/${id_voucher}/`

    console.log(urlVouchers)

    fetch(urlVouchers, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // arr unique
        console.log(data)
        this.url_invoices = url

        if (data.data.attachments.length != 0) {
          this.ft_download_voucher(data.data.attachments[0].id)
          console.log(url)
          this.setOpen(true)
        } else {
          this.file_watchVoucher = ""
        }

      })
      .catch(error => console.error('Error:', error));
  }

  ft_download_voucher(idDowload: number) {
    const urlDownloadVoucher = `https://kabaygroup.com/api/attachment/${idDowload}/download/`
    console.log(urlDownloadVoucher)

    this.file_watchVoucher = urlDownloadVoucher

  }

  getDateInString(_timestamp: any) {
    return new Date(_timestamp).toLocaleDateString()
  }

  groupProductsByInvoiceId(data: any) {
    const grouped = data.products.reduce((acc: any[], product: any) => {
      const existingGroup = acc.find((group: any) => group.invoice.id === product.invoice.id);

      if (existingGroup) {
        existingGroup.products.push(product);
      } else {
        acc.push({
          invoice: product.invoice,
          products: [product],
        });
      }

      return acc;
    }, []);

    return {
      ...data,
      productos_agrupados_por_invoice_id: grouped,
    };
  };

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    console.clear()
    console.log(this.dataUser.arr_students)
    this.dataUser.arr_students.forEach((est) => {
      est.product_groups = this.groupProductsByInvoiceId(est).productos_agrupados_por_invoice_id
      console.log("__________________ progs ")
      console.log(est.product_groups)
    })
    this.ft_save_idVoucher()
  }

}
