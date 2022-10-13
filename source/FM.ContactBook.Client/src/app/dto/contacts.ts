import { ResponseBase } from "./response-base";

export class ContactDto {
    contactId: number;
    title: string;
    surname: string;
    forename: string;
    birthDate: Date | string;
    phoneNumber: string;
    iban: string;
    address: ContactAddressDto;
}

export class ContactListItemDto {
    contactId: number;
    fullName: string;
    age: number;
    fullAddress: any;
    phoneNumber: string;
    iban: string;
}

export class ContactAddressDto {
    street: string;
    houseNumber: number;
    district: string;
    city: string;
    postCode: number;
    country: string;
}

export class CreateContactRequest {
    contact: ContactDto;
}

export class CreateContactResponse extends ResponseBase {
    contactListItem: ContactListItemDto;
}

export class DeleteContactRequest {
    contactId: number;
}

export class DeleteContactResponse extends ResponseBase {
}

export class LoadContactListResponse extends ResponseBase {
   contactList: ContactListItemDto[];
}

export class LoadContactResponse extends ResponseBase {
    contact: ContactDto;
}

export class UpdateContactRequest {
    contact: ContactDto;
}

export class UpdateContactResponse extends ResponseBase {
    contactListItem: ContactListItemDto;
}