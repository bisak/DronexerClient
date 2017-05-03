import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExploreComponent } from './components/explore/explore.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UploadComponent } from './components/upload/upload.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AuthGuard } from './guards/auth.guard'
import { ReverseAuthGuard } from './guards/reverse-auth.guard'

/*TODO reverse authguard for register and login routes.*/
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent, canActivate: [ReverseAuthGuard]},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuard]},
  {path: 'user/settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'about', component: AboutUsComponent},
  {path: 'privacy', component: PrivacyPolicyComponent},
  {path: 'disclaimer', component: DisclaimerComponent},
  {path: 'terms', component: TermsOfUseComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'page-not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'page-not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
