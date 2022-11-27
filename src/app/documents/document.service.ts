import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];
  documentChangedEvent = new EventEmitter<Document[]>();
  maxDocumentId: number;

  constructor(private httpClient: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
   }

  getDocuments() {
    this.httpClient.get<{documents: Document[]}>("http://localhost:3000/documents")
      .subscribe(response => {
        console.log(response.documents);
        this.documents = response.documents ? response.documents : [];
        this.sortAndSend();
      });
    
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    for (let document of this.documents) {
      if (document.id == id) {
        return document;
      }
    }
    return null;
   }
  
  getMaxId(): number {
    let maxId = 0

    for (let document of this.documents){
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  
addDocument(document: Document) {
  if (!document) {
    return;
  }

  // make sure id of the new Document is empty
  document.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.httpClient.post<{ message: string, documents: Document }>('http://localhost:3000/documents',
    document,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.documents);
        this.sortAndSend();
      }
    );
}

updateDocument(originalDocument: Document | null, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === originalDocument.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newDocument.id = originalDocument.id;
  // newDocument._id = originalDocument._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.httpClient.put('http://localhost:3000/documents/' + originalDocument.id,
    newDocument, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      }
    );
}

deleteDocument(document: Document) {

  if (!document) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.httpClient.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );
}

  // storeDocuments(documentsListClone: Document[]) {
  //   const documentsJson = JSON.stringify(documentsListClone);
  //   const httpHeader = new HttpHeaders(
  //     {'Content-Type': 'application/json'},
  //   );
  //   this.httpClient.put(
  //     'https://cms-project-61cff-default-rtdb.firebaseio.com/documents.json',
  //      documentsJson, 
  //      {headers: httpHeader}
  //   ).subscribe(
  //     () => {
  //       this.documentListChangedEvent.next(documentsListClone);
  //     }
  //   )
  // } 
 
  sortAndSend() {
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((a: Document, b: Document) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });
    const clonedDocuments = this.documents.slice()
    this.documentListChangedEvent.next(clonedDocuments);
  }
}
