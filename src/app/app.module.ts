import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterializeModule } from 'angular2-materialize';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExploreComponent } from './components/explore/explore.component';
import { NotFoundComponent } from './components/not-found/not-found.component'


import { ApiService } from "./services/api.service"
import { AuthService } from './services/auth.service'
import { ToastService } from './services/toast.service'
import { ValidateService } from './services/validate.service'
import { ProfileService } from './services/profile.service'

import { AuthGuard } from './guards/auth.guard';
import { UploadComponent } from './components/upload/upload.component';
import { PicturesService } from "./services/pictures.service";
import { StaticDataService } from "./services/static-data.service";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    RegisterComponent,
    AboutUsComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    DisclaimerComponent,
    ExploreComponent,
    NotFoundComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    FileUploadModule,
    MaterializeModule
  ],
  providers: [
    ApiService,
    ValidateService,
    ToastService,
    AuthService,
    ProfileService,
    PicturesService,
    StaticDataService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
