import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    if(config.data && config.data.errorMsg) {
      this.errorMsg = config.data.errorMsg;
    }
  }

  errorMsg: string = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';

  close(): void {
    this.ref.close();
  }
}