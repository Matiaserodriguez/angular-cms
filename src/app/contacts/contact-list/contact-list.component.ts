import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  term: string;
  public contacts: Contact[] = [];

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts()
    this.subscription = this.contactService.contactListChangedEvent
      .subscribe((contactsList: Contact[]) => this.contacts = contactsList);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
  
search(value: string) {
  this.term = value;
  }

}
