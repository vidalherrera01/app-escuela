import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonFooter, IonGrid, IonCol, IonRow, IonFab, IonFabButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonRow, IonCol, IonGrid, IonFooter, RouterModule]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
