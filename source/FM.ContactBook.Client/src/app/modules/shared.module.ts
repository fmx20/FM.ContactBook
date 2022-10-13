import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from 'src/app/services/auth.service';
import { DerivedDialogService } from 'src/app/services/dialog.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { LoadPanelService } from 'src/app/services/load-panel.service';

@NgModule({
    declarations: [
    ],
    imports: [
      CommonModule,
      FormsModule,
      BreadcrumbModule,
      ButtonModule,
      CalendarModule,
      ConfirmDialogModule,
      DropdownModule,
      DynamicDialogModule,
      InputMaskModule,
      InputTextModule,
      ProgressSpinnerModule,
      RippleModule,
      TableModule,
      ToastModule
    ],
    exports: [
      CommonModule,
      FormsModule,
      BreadcrumbModule,
      ButtonModule,
      CalendarModule,
      ConfirmDialogModule,
      DropdownModule,
      DynamicDialogModule,
      InputMaskModule,
      InputTextModule,
      ProgressSpinnerModule,
      RippleModule,
      TableModule,
      ToastModule
    ]
  })
  export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
      return {
        ngModule: SharedModule,
        providers: [ 
          AuthService,
          ConfirmationService,
          ContactsService,
          DialogService,
          DerivedDialogService,
          LoadPanelService,
          MessageService
        ]
      };
    }
  }