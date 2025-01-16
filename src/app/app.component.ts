import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButtons, IonTitle, IonMenu, IonMenuButton, IonContent, IonToolbar, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonMenu, IonMenuButton, IonTitle, IonButtons, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() { }
}
