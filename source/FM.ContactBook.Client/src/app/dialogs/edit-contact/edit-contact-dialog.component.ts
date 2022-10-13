import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactAddressDto, ContactDto } from 'src/app/dto/contacts';

@Component({
  selector: 'edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent {
  constructor(config: DynamicDialogConfig, private ref: DynamicDialogRef) {
    if(config.data && config.data.contact) {
      this.contact = Object.assign({}, config.data.contact);
      this.contact.address = Object.assign({}, config.data.contact.address);
    } else {
      this.contact = new ContactDto();
      this.contact.address = new ContactAddressDto();
    }
  }

  contact: ContactDto;

  get canSave(): boolean {
    if(!this.contact) {
      return false;
    }
    if(!this.contact.forename || !this.contact.forename.length) {
      return false;
    }
    if(!this.contact.surname || !this.contact.surname.length) {
      return false;
    }
    if(!this.contact.iban || this.contact.iban.length != 22) {
      return false;
    }
    return true;
  }

  close(): void {
    this.ref.close();
  }

  submit(): void {
    this.ref.close(this.contact);
  }
}