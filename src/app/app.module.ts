/** Imports */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

/** Declarations */
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './web/generalcomponents/footer/footer.component';
import {HeaderComponent} from './web/generalcomponents/header/header.component';
import {MenuComponent} from './web/generalcomponents/menu/menu.component';
import {HourFormComponent} from './web/usercomponents/hour-form/hour-form.component';
import {HourTableRecentComponent} from './web/usercomponents/hour-table-recent/hour-table-recent.component';
import {HelpModalComponent} from './web/generalcomponents/modals/help/help.modal.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {HourTableTotalComponent} from './web/usercomponents/hour-table-total/hour-table-total.component';
import {ManageUsersComponent} from './web/admincomponents/manage-users/manage-users.component';
import {AuthGuard} from './shared/services/authGuard.service';
import {AuthService} from './shared/services/auth.service';
import {TokenInterceptorService} from './shared/services/interceptors/TokenInterceptor.service';
import {BaseUrlInterceptorService} from './shared/services/interceptors/BaseUrlInterceptor.service';
import {ErrorInterceptorService} from './shared/services/interceptors/ErrorInterceptor.service';
import {MessageService} from './shared/services/message.service';
import {DatabaseService} from './shared/services/database.service';
import {HourTableRecentAdminComponent} from './web/admincomponents/hour-table-recent-admin/hour-table-recent.component-admin';
import {HourTableAllAdminComponent} from './web/admincomponents/hour-table-all-admin/hour-table-all.component-admin';
import {ProfileComponent} from './web/usercomponents/profile/profile.component';
import {DataTablesModule} from 'angular-datatables';
import {DatelessShortTime} from './shared/pipes/DatelessShortTime';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    HourFormComponent,
    HourTableRecentComponent,
    HourTableRecentAdminComponent,
    HelpModalComponent,
    NotFoundComponent,
    HourTableTotalComponent,
    HourTableAllAdminComponent,
    ManageUsersComponent,
    ProfileComponent,
    DatelessShortTime
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    DataTablesModule,
    ToastrModule.forRoot()
  ],
  providers: [AppRoutingModule, AuthService, AuthGuard, MessageService, DatabaseService, DatelessShortTime,
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
