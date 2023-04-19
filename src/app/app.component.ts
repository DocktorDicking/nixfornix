import {Component} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TimeService} from './shared/services/time.service';
import {StateService} from './shared/services/state.service';
import {UserService} from './shared/services/user.service';
import {AuthService} from './shared/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {ExcelService} from './shared/services/excel.service';
import {MailerService} from './shared/services/mailer.service';
import {ChartdataService} from './shared/services/chartdata.service';
import {AdminLogService} from './shared/services/adminlog.service';
import {LocationService} from './shared/services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TimeService, StateService, UserService, ExcelService, MailerService, ChartdataService, AdminLogService, LocationService]
})
export class AppComponent {
  title = 'nix4nix';

  // TODO: Check if TimeService actually need to be initialized in this constructor. Seems to me its bollocks.
  constructor(private titleService: Title, private meta: Meta, private http: HttpClient, private auth: AuthService) {
    titleService.setTitle('Nix4Nix - Urenregistratie');
    meta.addTag({name: 'description', content: ''}, true);
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1'}, true);
    meta.addTag({name: 'robots', content: 'all,follow'}, true);
  }
}
