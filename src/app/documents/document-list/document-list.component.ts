import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  documents: Document[] = [];

  constructor(private docService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.docService.getDocuments()
    this.subscription = this.docService.documentListChangedEvent
      .subscribe((documentsList: Document[]) => this.documents = documentsList);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
}
