import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(
    private httpClient: HttpClient
  ) {
    // this.messages = MOCKMESSAGES;
   }

   getMessages() {
    this.httpClient.get<{messages: Message[]}>("http://localhost:3000/messages")
      .subscribe(response => {
        console.log(response.messages);
        this.messages = response.messages ? response.messages : [];
        this.sortAndSend();
      });
    
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
   }

   getMaxId(): number {
    let maxId = 0

    for (let message of this.messages){
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
  
    // make sure id of the new Message is empty
    message.id = '';
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // add to database
    this.httpClient.post<{ message: string, messages: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.messages);
          this.sortAndSend();
        }
      );
  }

  sortAndSend() {
    this.maxMessageId = this.getMaxId();
    this.messages.sort((a: Message, b: Message) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });
    const clonedMessages = this.messages.slice()
    this.messageListChangedEvent.next(clonedMessages);
  }
}
