import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UploadPictureComponent } from './components/upload-picture/upload-picture.component'
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExploreComponent } from './components/explore/explore.component';

import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'upload', component: UploadPictureComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutUsComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'terms', component: TermsOfUseComponent },
  { path: 'explore', component: ExploreComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
