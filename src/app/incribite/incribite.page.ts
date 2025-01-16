import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonButton, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DataUserService } from '../services/data-user.service';

@Component({
  selector: 'app-incribite',
  templateUrl: './incribite.page.html',
  styleUrls: ['./incribite.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonText, IonContent, CommonModule, FormsModule]
})
export class IncribitePage implements OnInit {
  ft_goClass() {
    this.router.navigate(['/register']);
  }

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

}
