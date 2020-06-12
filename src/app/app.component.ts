import { Component, NgModule } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TimeService } from './shared/services/time.service';
import { StateService } from './shared/services/state.service';
import { SessionService } from './shared/services/session.service';
import { UserService } from './shared/services/user.service';
import { DatabaseService } from './shared/services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ TimeService, StateService, SessionService, UserService, DatabaseService ]
})
export class AppComponent {
  title = 'nixfornix';

  // TODO: Check if TimeService actually need to be initialized in this constructor. Seems to me its bollocks.
  constructor(private titleService: Title, private meta: Meta, private timeService: TimeService) {
    titleService.setTitle('NixforNix - Urenregistratie');
    meta.addTag({name: 'description', content: ''}, true);
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1'}, true);
    meta.addTag({name: 'robots', content: 'all,follow'}, true);
  }
}
