import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})

export class MessageListComponent implements OnInit {
  @Input() messages: Message[] = [
    new Message('1', 'New first post', 'New first post added', 'Bro. Jackson'),
    new Message('2', 'New second post', 'New second post added', 'Bro. Johnson'),
    new Message('3', 'New third post', 'New third post added', 'Bro. Rodriguez'),
  ];

  constructor() { };

  ngOnInit(): void {
  };

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
