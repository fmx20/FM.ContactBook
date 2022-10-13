import { Component, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';

import { CanComponentDeactivate } from 'src/app/guards/can-deactivate.guard';
import { AuthService } from 'src/app/services/auth.service';
import { opacityAnimation } from 'src/app/animations';
import { UserLoginDto } from 'src/app/dto/auth';
import { DerivedDialogService } from 'src/app/services/dialog.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    opacityAnimation
  ]
})
export class MainComponent implements CanComponentDeactivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DerivedDialogService) {

    this.user = this.authService.user;
  }

  @HostBinding('@opacityAnimation') 
  routeAnimation = true;

  user: UserLoginDto | null;

  async logout(): Promise<void> {
    try {
      let result = await lastValueFrom(this.authService.logout());       
      if(result.isError) {
        if(result.errorCode == 711) {
          this.dialogService.showSessionDialog();
          return;
        }
        throw result.errorMsg;
      }

      this.authService.loggedIn = false;
      this.authService.sessionToken = null;
      this.authService.user = null;

      this.router.navigate(['/login']);
    } catch(e) {
      console.log(e);
      this.dialogService.showErrorDialog();
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.authService.loggedIn;
  }
}