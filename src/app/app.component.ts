import {Component} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TimeService} from './shared/services/time.service';
import {StateService} from './shared/services/state.service';
import {UserService} from './shared/services/user.service';
import {ExcelService} from './shared/services/excel.service';
import {MailerService} from './shared/services/mailer.service';
import {ChartdataService} from './shared/services/chartdata.service';
import {AdminLogService} from './shared/services/adminlog.service';
import {LocationService} from './shared/services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // Services delcared here are considered global and
  providers: [TimeService, StateService, UserService, ExcelService, MailerService, ChartdataService, AdminLogService, LocationService]
})
export class AppComponent {
  title = 'nix4nix';

  constructor(private titleService: Title, private meta: Meta) {
    titleService.setTitle('Nix4Nix - Urenregistratie');
    meta.addTag({name: 'description', content: ''}, true);
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1'}, true);
    meta.addTag({name: 'robots', content: 'noindex'}, true);
  }
}
