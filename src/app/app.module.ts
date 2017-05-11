import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterializeDirective, MaterializeModule } from 'angular2-materialize';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShareButtonsModule } from 'ng2-sharebuttons';

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

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
import { ValidateService } from './services/validate.service';
import { ProfileService } from './services/profile.service';

import { AuthGuard } from './guards/auth.guard';
import { UploadComponent } from './components/upload/upload.component';
import { PicturesService } from "./services/pictures.service";
import { StaticDataService } from "./services/static-data.service";
import { DatesService } from "./utilities/dates.service";
import { AuthHelperService } from "./utilities/auth-helper.service";
import { PostComponent } from './components/post/post.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PostsService } from "./services/posts.service";
import { SettingsComponent } from './components/settings/settings.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { ModalConfirmPasswordComponent } from './components/modal-confirm-password/modal-confirm-password.component';
import { ReverseAuthGuard } from "./guards/reverse-auth.guard";
import { UploadPictureFormComponent } from './components/upload-picture-form/upload-picture-form.component';
import { TagsComponent } from './components/tags/tags.component';

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
    UploadComponent,
    PostComponent,
    LoaderComponent,
    SettingsComponent,
    ModalDeleteComponent,
    ModalEditComponent,
    ModalConfirmPasswordComponent,
    UploadPictureFormComponent,
    TagsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterializeModule,
    InfiniteScrollModule,
    ShareButtonsModule.forRoot()
  ],
  providers: [
    AuthGuard,
    ReverseAuthGuard,
    ApiService,
    ValidateService,
    ToastService,
    AuthService,
    ProfileService,
    PicturesService,
    StaticDataService,
    DatesService,
    AuthHelperService,
    PostsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
