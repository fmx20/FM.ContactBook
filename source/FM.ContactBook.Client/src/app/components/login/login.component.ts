import { Component, HostBinding } from '@angular/core';  
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { opacityAnimation } from 'src/app/animations';
import { environment } from 'src/environments/environment';
import { DerivedDialogService } from 'src/app/services/dialog.service';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [opacityAnimation]
})
export class LoginComponent {
  constructor( 
    private router: Router,
    private authService: AuthService, 
    private dialogService: DerivedDialogService,
    private messageService: MessageService) {

    if(!environment.production) {
      this.username = 'fmueller';
      this.password = 'fm123';
    }
  }

  @HostBinding('@opacityAnimation') 
  routeAnimation = true;

  isLoading: boolean;
  password: string;
  username: string;

  async login(): Promise<void> {
    this.isLoading = true; 
    try {
      let result = await lastValueFrom(this.authService.login(this.username, this.password));
      if(result.isError) {
        if(result.errorCode == 300) {
          this.messageService.add({severity:'error', summary:'Anmelden', detail: result.errorMsg});
          return;
        }
        throw result.errorMsg;
      }

      this.messageService.clear();
      this.router.navigate(['/contacts']);
    } catch (e) {
      console.error(e);
      this.dialogService.showErrorDialog();
    } finally {
      this.isLoading = false; 
    }
  }
}