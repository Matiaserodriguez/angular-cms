import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  nativeWindow: any;
  document: Document | null;

  constructor(
    private documentService: DocumentService,
    private router: Router, 
    private route: ActivatedRoute,
    private windRefService: WindRefService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.document = this.documentService.getDocument(params['id']);
        }
      );

      this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onView() {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url)
    }
  }

  onDelete() {
    if (this.document){
      this.documentService.deleteDocument(this.document);
    }
    this.router.navigate(['/documents']);
 }

}
