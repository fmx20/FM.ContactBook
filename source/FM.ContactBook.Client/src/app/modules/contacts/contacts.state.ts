import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { MessageService } from "primeng/api";
import { tap } from "rxjs";
import { ContactDto, ContactListItemDto } from "src/app/dto/contacts";
import { AuthService } from "src/app/services/auth.service";
import { ContactsService } from "src/app/services/contacts.service";
import { DerivedDialogService } from "src/app/services/dialog.service";

// actions
export class CreateContact {
    static readonly type = '[Contacts] Create Contact';
    constructor(public contact: ContactDto) {}
}

export class DeleteContact {
    static readonly type = '[Contacts] Delete Contact';
    constructor(public contactId: number) {}
}

export class LoadContactList {
    static readonly type = '[Contacts] Load Contact List';
}

export class UpdateContact {
    static readonly type = '[Contacts] Update Contact';
    constructor(public contact: ContactDto) {}
}

// state model
export class ContactsStateModel {
    contactList: ContactListItemDto[];
    loading: boolean;
    selectedContact: ContactListItemDto | null;
}

// state
@State<ContactsStateModel>({
    name: 'contacts',
    defaults: {
        contactList: [],
        loading: false,
        selectedContact: null
    }
})
@Injectable()
export class ContactsState {
    constructor(
        private authService: AuthService,
        private contactsService: ContactsService,
        private dialogService: DerivedDialogService,
        private messageService: MessageService) {}

    @Selector()
    static contactList(state: ContactsStateModel): ContactListItemDto[] {
        return state.contactList;
    }

    @Selector()
    static loading(state: ContactsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    static selectedContact(state: ContactsStateModel): ContactListItemDto | null {
        return state.selectedContact;
    }

    @Action(CreateContact)
    createContact(ctx: StateContext<ContactsStateModel>, action: CreateContact) {
        ctx.patchState({loading: true});

        return this.contactsService.createContact(action.contact, this.authService.sessionToken).pipe(
            tap(result => {
                try {
                    if(result.isError) {
                        if(result.errorCode == 300) {
                            this.messageService.add({severity:'error', summary:'Achtung', detail: result.errorMsg});
                            return;
                        } else if(result.errorCode == 711) {
                            this.dialogService.showSessionDialog();
                            return;
                        } else {
                            throw result.errorMsg;
                        }
                    }
    
                    ctx.setState(
                        patch<ContactsStateModel>({
                            contactList: append<ContactListItemDto>([result.contactListItem])
                        })
                    );

                    ctx.patchState({selectedContact: result.contactListItem});

                    this.messageService.add({severity:'success', summary:'Hinzufügen', detail: 'Der Kontakt wurde erfolgreich hinzugefügt.'});
                } catch(e) {
                    console.error(e);
                    this.dialogService.showErrorDialog();
                } finally {
                    ctx.patchState({loading: false});
                }
            })
        );
    }

    @Action(DeleteContact)
    deleteContact(ctx: StateContext<ContactsStateModel>, action: DeleteContact) {
        ctx.patchState({loading: true});

        return this.contactsService.deleteContact(action.contactId, this.authService.sessionToken).pipe(
            tap(result => {
                try {
                    if(result.isError) {
                        if(result.errorCode == 300) {
                            this.messageService.add({severity:'error', summary:'Achtung', detail: result.errorMsg});
                            return;
                        } else if(result.errorCode == 711) {
                            this.dialogService.showSessionDialog();
                            return;
                        } else {
                            throw result.errorMsg;
                        }
                    }
    
                    ctx.setState(
                        patch<ContactsStateModel>({
                            contactList: removeItem<ContactListItemDto>(i => i?.contactId === action.contactId)
                        })
                    );

                    ctx.patchState({selectedContact: null});

                    this.messageService.add({severity:'success', summary:'Löschen', detail: 'Der Kontakt wurde erfolgreich gelöscht.'});
                } catch(e) {
                    console.error(e);
                    this.dialogService.showErrorDialog();
                } finally {
                    ctx.patchState({loading: false});
                }
            })
        );
    }

    @Action(LoadContactList)
    loadContactList(ctx: StateContext<ContactsStateModel>, action: LoadContactList) {
        ctx.patchState({loading: true});
        return this.contactsService.loadContactList(this.authService.sessionToken).pipe(
            tap(result => {
                try {
                    if(result.isError) {
                        if(result.errorCode == 300) {
                            this.messageService.add({severity:'error', summary:'Achtung', detail: result.errorMsg});
                            return;
                        } else if(result.errorCode == 711) {
                            this.dialogService.showSessionDialog();
                            return;
                        } else {
                            throw result.errorMsg;
                        }
                    }
    
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        contactList: result.contactList
                    });
                } catch(e) {
                    console.error(e);
                    this.dialogService.showErrorDialog();
                } finally {
                    ctx.patchState({loading: false});
                }
            })
        );
    }

    @Action(UpdateContact)
    updateContact(ctx: StateContext<ContactsStateModel>, action: UpdateContact) {
        ctx.patchState({loading: true});

        return this.contactsService.updateContact(action.contact, this.authService.sessionToken).pipe(
            tap(result => {
                try {
                    if(result.isError) {
                        if(result.errorCode == 300) {
                            this.messageService.add({severity:'error', summary:'Achtung', detail: result.errorMsg});
                            return;
                        } else if(result.errorCode == 711) {
                            this.dialogService.showSessionDialog();
                            return;
                        } else {
                            throw result.errorMsg;
                        }
                    }
    
                    ctx.setState(
                        patch<ContactsStateModel>({
                            contactList: updateItem<ContactListItemDto>(
                                i => i?.contactId === result.contactListItem.contactId,
                                result.contactListItem
                            )
                        })
                    );

                    ctx.patchState({selectedContact: result.contactListItem});

                    this.messageService.add({severity:'success', summary:'Bearbeiten', detail: 'Der Kontakt wurde erfolgreich gespeichert.'});
                } catch(e) {
                    console.error(e);
                    this.dialogService.showErrorDialog();
                } finally {
                    ctx.patchState({loading: false});
                }
            })
        );
    }

}