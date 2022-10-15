import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private docService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.docService.getDocuments()
  }

  onSelectedDocument(document: Document) {
    this.docService.documentSelectedEvent.emit(document)
  }

}
