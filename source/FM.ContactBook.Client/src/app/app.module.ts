import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared.module';
import { LoadPanelComponent } from './components/load-panel/load-panel.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ErrorDialogComponent } from './dialogs/error/error-dialog.component';
import { EditContactDialogComponent } from './dialogs/edit-contact/edit-contact-dialog.component';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [
    AppComponent,
    LoadPanelComponent,
    LoginComponent,
    MainComponent,
    EditContactDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    NgxsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
