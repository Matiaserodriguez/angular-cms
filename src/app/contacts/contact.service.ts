import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  maxContactId: number;


  constructor(
    private httpClient: HttpClient
  ) {}

   getContacts(): Contact[] {
    this.httpClient.get('https://cms-project-61cff-default-rtdb.firebaseio.com/contacts.json')
      .subscribe((contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          contacts.sort((a: Contact, b: Contact) => {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
          });
          const clonedContacts = contacts.slice()
          this.contactListChangedEvent.next(clonedContacts);
      }, (error: any) => {
          console.log(error);
      }
    )
    return this.contacts.slice();
  } 

  getMaxId(): number {
    let maxId = 0

    for (let contact of this.contacts){
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

   getContact(id: string): Contact | null {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
   }

  addContact(newContact: Contact) {
    if (!newContact) return;
    this.maxContactId++
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);

    const contactsListClone = this.contacts.slice();
    this.storeContacts(contactsListClone);
  }

  updateContact(originalContact: Contact | null, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.indexOf(originalContact)
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClone = this.contacts.slice();
    this.storeContacts(contactsListClone);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact)
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    const contactsListClone = this.contacts.slice();
    this.storeContacts(contactsListClone);
  }

  storeContacts(contactsListClone: Contact[]) {
    const contactsJson = JSON.stringify(contactsListClone);
    const httpHeader = new HttpHeaders(
      {'Content-Type': 'application/json'},
    );
    this.httpClient.put(
      'https://cms-project-61cff-default-rtdb.firebaseio.com/contacts.json',
       contactsJson, 
       {headers: httpHeader}
    ).subscribe(
      () => {
        this.contactListChangedEvent.next(contactsListClone);
      }
    )
  } 

}
