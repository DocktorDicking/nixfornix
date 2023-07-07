import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-modals', // TODO rename to menu-help-modals
  templateUrl: './help.modal.component.html'
})
export class HelpModalComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  public readonly environment = environment;
}
