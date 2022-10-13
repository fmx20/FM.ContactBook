import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../shared.module';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactsState } from './contacts.state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ContactsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ContactsState])
  ],
  declarations: [
    ContactsComponent
  ]
})
export class ContactsModule { }