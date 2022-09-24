import { Component, OnInit } from '@angular/core';
import { contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  public contacts: contact[] = [{
    id: "1",
    name: "R. Kent Jackson",
    email: "jacksonk@byui.edu",
    phone: "208-496-3771",
    imageUrl: "../../assets/images/jacksonk.jpg",
    group: []
  },
  {
    id: "2",
    name: "Rex Barzee",
    email: "barzeer@byui.edu",
    phone: "208-496-3768",
    imageUrl: "../../assets/images/barzeer.jpg",
    group: []
  }]

  constructor() { }

  ngOnInit(): void {
  }

}
