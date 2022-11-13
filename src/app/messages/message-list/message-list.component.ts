import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})

export class MessageListComponent implements OnInit {
  @Input() messages: Message[] = [];

  constructor(private messageService: MessageService) { };

  ngOnInit(): void {
    this.messages = this.messageService.getMessages()
    this.messageService.messageListChangedEvent
      .subscribe(item => this.messages = item)
  };

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
