import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent
  },
  {
    path: '', 
    component: MainComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    children: [
      {
        path: 'contacts', 
        loadChildren: () => import('./modules/contacts/contacts.module').then(mod => mod.ContactsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    CanDeactivateGuard
  ]
})
export class AppRoutingModule { }
