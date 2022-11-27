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

  getContacts() {
    this.httpClient.get<{contacts: Contact[]}>("http://localhost:3000/contacts")
      .subscribe(response => {
        console.log(response.contacts);
        this.contacts = response.contacts ? response.contacts : [];
        this.sortAndSend();
      });
    
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

   addContact(contact: Contact) {
    if (!contact) {
      return;
    }
  
    // make sure id of the new Contact is empty
    contact.id = '';
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.httpClient.post<{contacts: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contacts);
          this.sortAndSend();
        }
      );
  }
  
  updateContact(originalContact: Contact | null, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
  
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);
  
    if (pos < 0) {
      return;
    }
  
    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    // newContact._id = originalContact._id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // update database
    this.httpClient.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }
  
  deleteContact(contact: Contact) {
  
    if (!contact) {
      return;
    }
  
    const pos = this.contacts.findIndex(d => d.id === contact.id);
  
    if (pos < 0) {
      return;
    }
  
    // delete from database
    this.httpClient.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  // storeContacts(contactsListClone: Contact[]) {
  //   const contactsJson = JSON.stringify(contactsListClone);
  //   const httpHeader = new HttpHeaders(
  //     {'Content-Type': 'application/json'},
  //   );
  //   this.httpClient.put(
  //     'https://cms-project-61cff-default-rtdb.firebaseio.com/contacts.json',
  //      contactsJson, 
  //      {headers: httpHeader}
  //   ).subscribe(
  //     () => {
  //       this.contactListChangedEvent.next(contactsListClone);
  //     }
  //   )
  // } 

  sortAndSend() {
    this.maxContactId = this.getMaxId();
    this.contacts.sort((a: Contact, b: Contact) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });
    const clonedContacts = this.contacts.slice()
    this.contactListChangedEvent.next(clonedContacts);
  }
}
