import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('msgText') msgText;
  @ViewChild('subject') subject;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = 'Matias';

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const message = this.msgText.nativeElement.value;
    const subject = this.subject.nativeElement.value;
    const newMessage = new Message('1234', subject, message, this.currentSender);
    this.addMessageEvent.emit(newMessage)
  }

  onClear() {
    this.msgText.nativeElement.value = '';
    this.subject.nativeElement.value = '';
  }
}
