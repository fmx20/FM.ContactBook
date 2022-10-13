import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { 
  ContactDto, 
  CreateContactRequest, 
  CreateContactResponse, 
  DeleteContactRequest, 
  DeleteContactResponse, 
  LoadContactListResponse, 
  LoadContactResponse, 
  UpdateContactRequest, 
  UpdateContactResponse } from '../dto/contacts';
import * as moment from 'moment';

@Injectable()
export class ContactsService {
  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    // when deploying with proxy, check for production mode and add Prefix like /ContactBook (should be the path from the server proxy)
    return '/api/contacts';
  }

  createContact(contact: ContactDto, sessionToken: string | null): Observable<CreateContactResponse> {
    let request = new CreateContactRequest();
    request.contact = contact;
    if(request.contact.birthDate) {
      request.contact.birthDate = moment(request.contact.birthDate).format('YYYY-MM-DD');
    }

    const headers = <any>{ 't': sessionToken };

    return this.http.post<CreateContactResponse>(this.baseUrl, request, { headers });
  }

  deleteContact(contactId: number, sessionToken: string | null): Observable<DeleteContactResponse> {
    let request = new DeleteContactRequest();
    request.contactId = contactId;

    const headers = <any>{ 't': sessionToken };

    return this.http.delete<DeleteContactResponse>(this.baseUrl, { headers, body: request });
  }

  loadContact(contactId: number, sessionToken: string | null): Observable<LoadContactResponse> {
    const headers = <any>{ 't': sessionToken };

    return this.http.get<LoadContactResponse>(this.baseUrl + '/' + contactId, { headers }).pipe(
      map((result) => {
        if(result.contact.birthDate) {
          result.contact.birthDate = new Date(result.contact.birthDate)
        }

        return result;
      })
    );
  }

  loadContactList(sessionToken: string | null): Observable<LoadContactListResponse> {
    const headers = <any>{ 't': sessionToken };

    return this.http.get<LoadContactListResponse>(this.baseUrl, { headers });
  }

  updateContact(contact: ContactDto, sessionToken: string | null): Observable<UpdateContactResponse> {
    let request = new UpdateContactRequest();
    request.contact = contact;
    if(request.contact.birthDate) {
      request.contact.birthDate = moment(request.contact.birthDate).format('YYYY-MM-DD');
    }

    const headers = <any>{ 't': sessionToken };

    return this.http.put<UpdateContactResponse>(this.baseUrl, request, { headers });
  }

}