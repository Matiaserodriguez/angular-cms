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

  getDocuments(): Document[] {
    this.httpClient.get('https://cms-project-61cff-default-rtdb.firebaseio.com/documents.json')
      .subscribe((documents: Document[] ) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          documents.sort((a: Document, b: Document) => {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
          });
          const clonedDocuments = documents.slice()
          this.documentListChangedEvent.next(clonedDocuments);
      }, (error: any) => {
          console.log(error);
      }
    )
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

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);

    const documentsListClone = this.documents.slice()
    this.storeDocuments(documentsListClone);
  }

  updateDocument(originalDocument: Document | null, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.indexOf(originalDocument)
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone = this.documents.slice();
    this.storeDocuments(documentsListClone);
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document)
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    const documentsListClone = this.documents.slice();
    this.storeDocuments(documentsListClone);
  }

  storeDocuments(documentsListClone: Document[]) {
    const documentsJson = JSON.stringify(documentsListClone);
    const httpHeader = new HttpHeaders(
      {'Content-Type': 'application/json'},
    );
    this.httpClient.put(
      'https://cms-project-61cff-default-rtdb.firebaseio.com/documents.json',
       documentsJson, 
       {headers: httpHeader}
    ).subscribe(
      () => {
        this.documentListChangedEvent.next(documentsListClone);
      }
    )
  } 
 
}
