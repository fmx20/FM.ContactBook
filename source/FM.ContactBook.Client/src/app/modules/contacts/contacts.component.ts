import { Component, OnInit, ViewChild, HostBinding, ElementRef } from '@angular/core';      
import { AuthService } from 'src/app/services/auth.service';
import { opacityAnimation } from 'src/app/animations';
import { lastValueFrom, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { ContactsService } from 'src/app/services/contacts.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DerivedDialogService } from 'src/app/services/dialog.service';
import { ContactDto, ContactListItemDto } from 'src/app/dto/contacts';
import { Select, Store } from '@ngxs/store';
import { ContactsState, CreateContact, DeleteContact, LoadContactList, UpdateContact } from './contacts.state';

@Component({
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [opacityAnimation]
})
export class ContactsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private contactsService: ContactsService,
    private dialogService: DerivedDialogService,
    private messageService: MessageService,
    private store: Store) {

  }

  @HostBinding('@opacityAnimation') 
  routeAnimation = true;

  @ViewChild('dt', {static: true}) 
  dataTable: Table;

  @ViewChild('filterInput', {static: true}) 
  filterInput: ElementRef;

  @Select(ContactsState.contactList) 
  contacts$: Observable<ContactListItemDto[]>;

  @Select(ContactsState.loading) 
  contactsLoading$: Observable<boolean>;

  @Select(ContactsState.selectedContact) 
  selectedContact$: Observable<ContactListItemDto>;

  cols: Array<any> = [
    { field: 'fullName', header: 'Name' },
    { field: 'age', header: 'Alter' },
    { field: 'fullAddress', header: 'Adresse' },
    { field: 'phoneNumber', header: 'Tel.' },
    { field: 'iban', header: 'IBAN' }
  ]
  filterText: string; 
  selectedContact: ContactListItemDto;

  private async loadContact(): Promise<ContactDto | null> {
    try {
      let result = await lastValueFrom(this.contactsService.loadContact(this.selectedContact.contactId, this.authService.sessionToken));
      if(result.isError) {
        if(result.errorCode == 300) {
          this.messageService.add({severity:'error', summary:'Achtung', detail: result.errorMsg});
          return null;
        } else if(result.errorCode == 711) {
          this.dialogService.showSessionDialog();
          return null;
        } else {
          throw result.errorMsg;
        }
      }

      if(result.contact) {
        return result.contact;
      }
    } catch (e) {
      console.error(e);
      this.dialogService.showErrorDialog();
    }
    return null;
  }

  confirmDeleteContact(): void {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Kontakt löschen wollen?',
      accept: () => {
        this.store.dispatch(new DeleteContact(this.selectedContact.contactId));
      }
  });
  }

  filterChanged(e: any): void {
    this.dataTable.filterGlobal(e.target.value, 'contains');
  }

  resetFilter(): void {
    this.filterInput.nativeElement.value = null;
    this.filterInput.nativeElement.dispatchEvent(new Event('input'));
  }

  async showEditContactDialog(): Promise<void> {
    let contact = await this.loadContact();

    if(contact) {
      this.dialogService.showEditContactDialog(contact, (editedContact) => {
        this.store.dispatch(new UpdateContact(editedContact));
      })
    }
  }

  showNewContactDialog(): void {
    this.dialogService.showNewContactDialog((newContact) => {
      this.store.dispatch(new CreateContact(newContact));
    })
  }

  ngOnInit(): void {
    this.selectedContact$.subscribe((value) => {
      this.selectedContact = value;
    });

    this.store.dispatch(new LoadContactList());
  }
}