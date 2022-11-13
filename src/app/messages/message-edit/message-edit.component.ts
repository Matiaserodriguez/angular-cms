import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('msgText') msgText;
  @ViewChild('subject') subject;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = '19';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const message = this.msgText.nativeElement.value;
    const subject = this.subject.nativeElement.value;
    const newMessage = new Message('19', subject, message, this.currentSender);
    console.log(newMessage);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.msgText.nativeElement.value = '';
    this.subject.nativeElement.value = '';
  }
}
