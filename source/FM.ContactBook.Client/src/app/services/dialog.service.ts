import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditContactDialogComponent } from '../dialogs/edit-contact/edit-contact-dialog.component';
import { ErrorDialogComponent } from '../dialogs/error/error-dialog.component';
import { ContactDto } from '../dto/contacts';
import { AuthService } from './auth.service';

@Injectable()
export class DerivedDialogService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService) {

  }

  showEditContactDialog(contact: ContactDto, action: (contact: ContactDto) => void): void {
    let ref = this.dialogService.open(EditContactDialogComponent, {
      header: 'Bearbeiten',
      width: '600px',
      data: {
        contact: contact
      }
    });

    ref.onClose.subscribe((contact) => {
      if(contact) {
        action(contact);
      }
    });
  }

  showErrorDialog(msg: string | null = null): void {
    this.dialogService.open(ErrorDialogComponent, {
      header: 'Achtung',
      width: '440px'
    });
  }

  showNewContactDialog(action: (contact: ContactDto) => void): void {
    let ref = this.dialogService.open(EditContactDialogComponent, {
      header: 'Hinzufügen',
      width: '600px'
    });

    ref.onClose.subscribe((contact) => {
      if(contact) {
        action(contact);
      }
    });
  }

  showSessionDialog(): void {
    let ref = this.dialogService.open(ErrorDialogComponent, {
      header: 'Achtung',
      width: '440px',
      data: {
        errorMsg: 'Ihre Session ist abgelaufen. Sie müssen sich erneut anmelden.'
      }
    });

    ref.onClose.subscribe(() => {
      this.authService.reset();
      this.router.navigate(['/login']);
    });
  }


}