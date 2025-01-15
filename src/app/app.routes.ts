import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'class',
    loadComponent: () => import('./class/class.page').then(m => m.ClassPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'product',
    loadComponent: () => import('./product/product.page').then( m => m.ProductPage)
  },
  {
    path: 'purchase',
    loadComponent: () => import('./purchase/purchase.page').then( m => m.PurchasePage)
  },
  {
    path: 'incribite',
    loadComponent: () => import('./incribite/incribite.page').then( m => m.IncribitePage)
  },
];
