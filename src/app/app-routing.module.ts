import { RouterModule, Routes } from '@angular/router';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { AuthGuard } from './guards/auth.guard';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { SinglePostViewComponent } from './components/single-post-view/single-post-view.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { UploadComponent } from './components/upload/upload.component';
import { FeedComponent } from './components/feed/feed.component';
import { TagsComponent } from './components/tags/tags.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [ReverseAuthGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'user/settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'post/:id', component: SinglePostViewComponent },
  { path: 'tag/:tag', component: TagsComponent },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'discover', component: ExploreComponent },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
