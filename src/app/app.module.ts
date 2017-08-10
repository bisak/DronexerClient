import { AboutUsComponent } from './components/about-us/about-us.component';
import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthHelperService } from './utilities/auth-helper.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { DatesService } from './utilities/dates.service';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExploreComponent } from './components/explore/explore.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './components/login/login.component';
import { MaterializeModule } from 'angular2-materialize';
import { MetadataService } from './services/metadata.service';
import { ModalConfirmPasswordComponent } from './components/modal-confirm-password/modal-confirm-password.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './components/not-found/not-found.component'
import { PicturesService } from './services/pictures.service';
import { PostComponent } from './components/post/post.component';
import { PostsService } from './services/posts.service';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from './services/profile.service';
import { RegisterComponent } from './components/register/register.component';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { SinglePostViewComponent } from './components/single-post-view/single-post-view.component';
import { StaticDataService } from './services/static-data.service';
import { TagsComponent } from './components/tags/tags.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { ToastService } from './services/toast.service';
import { UploadComponent } from './components/upload/upload.component';
import { UploadPictureFormComponent } from './components/upload-picture-form/upload-picture-form.component';
import { ValidateService } from './services/validate.service';
import { FeedComponent } from './components/feed/feed.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UnixToDatePipe } from './pipes/unix-to-date.pipe';
import { InsertHashtagPipe } from './pipes/insert-hashtag.pipe';

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
    TagsComponent,
    SinglePostViewComponent,
    FeedComponent,
    TimeAgoPipe,
    UnixToDatePipe,
    InsertHashtagPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterializeModule,
    LeafletModule,
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
    PostsService,
    MetadataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
