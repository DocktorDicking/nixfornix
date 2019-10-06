import { Component } from '@angular/core';
import {Title, Meta} from '@angular/platform-browser';
import {TimeService} from './shared/services/time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TimeService]
})
export class AppComponent {
  title = 'nixfornix';

  constructor(private titleService: Title, private meta: Meta, private timeService: TimeService) {
    titleService.setTitle('NixforNix - Urenregistratie');
    meta.addTag({name: 'description', content: ''}, true);
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1'}, true);
    meta.addTag({name: 'robots', content: 'all,follow'}, true);
  }
}
