import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document('1', "New Document 1", 'New document 1 created', 'https://url1.com', []),
    new Document('2', "New Document 2", 'New document 2 created', 'https://url2.com', []),
    new Document('3', "New Document 3", 'New document 3 created', 'https://url3.com', []),
    new Document('4', "New Document 4", 'New document 4 created', 'https://url4.com', []),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document)
  }

}
