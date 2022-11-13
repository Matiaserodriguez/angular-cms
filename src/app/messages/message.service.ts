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

   getMessages(): Message[] {
    this.httpClient.get('https://cms-project-61cff-default-rtdb.firebaseio.com/messages.json')
      .subscribe((messages: Message[] ) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          messages.sort((a: Message, b: Message) => {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
          });
          const clonedMessages = messages.slice()
          this.messageListChangedEvent.next(clonedMessages);
      }, (error: any) => {
          console.log(error);
      }
    )
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

   addMessage(message: Message): void {
    this.messages.push(message);
    const messagesListClone = this.messages.slice();
    this.storeMessages(messagesListClone);
   }

   storeMessages(messagesListClone: Message[]) {
    const messagesJson = JSON.stringify(messagesListClone);
    const httpHeader = new HttpHeaders(
      {'Content-Type': 'application/json'},
    );
    this.httpClient.put(
      'https://cms-project-61cff-default-rtdb.firebaseio.com/messages.json',
       messagesJson, 
       {headers: httpHeader}
    ).subscribe(
      () => {
        this.messageListChangedEvent.next(messagesListClone);
      }
    )
  } 
}
