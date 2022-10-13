import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadPanelService } from 'src/app/services/load-panel.service';

@Component({
  selector: 'load-panel',
  templateUrl: './load-panel.component.html',
  styleUrls: ['./load-panel.component.scss']
})
export class LoadPanelComponent implements OnDestroy, OnInit {
  constructor(private loadPanelService: LoadPanelService) {
  }

  private sub: Subscription;

  @HostBinding('class.visible')
  public isVisible: boolean;

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public ngOnInit(): void {
    this.sub = this.loadPanelService.$setVisible.subscribe((visible: boolean) => {
      this.isVisible = visible;
    });
  }
}