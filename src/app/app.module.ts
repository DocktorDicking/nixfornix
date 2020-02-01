/** Imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SnackbarModule} from 'ngx-snackbar'; // TODO: Create some way to show fancy snackbars (in app notification stuff)

/** Declarations */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './web/footer/footer.component';
import { HeaderComponent } from './web/header/header.component';
import { MenuComponent } from './web/menu/menu.component';
import { HourFormComponent } from './web/hour-form/hour-form.component';
import { HourTableComponent } from './web/hour-table/hour-table.component';
import { HelpModalComponent } from './web/modals/help/help.modal.component';
import { HourUpdateComponent } from './web/modals/hour-update/hour-update.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
    HourTableComponent,
    HelpModalComponent,
    HourUpdateComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SnackbarModule.forRoot()
  ],
  providers: [AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
