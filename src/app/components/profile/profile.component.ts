import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service'
import { ActivatedRoute, Params, Router } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  visualiseData: any

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const username = params['username']
      this.profileService.getProfile(username).subscribe((retrievedData) => {
        this.visualiseData = retrievedData.data
        if (this.visualiseData.hasProfilePicture) {
          this.visualiseData.profilePicture = `${environment.apiUrl}api/users/profilePicture/${retrievedData.data.username}`
        } else {
          this.visualiseData.profilePicture = `${environment.apiUrl}api/users/profilePicture/default_profile_picture`
        }
        console.log(this.visualiseData)
      }, (error) => {
        console.log("errored in profilecomponent: ")
        if(error.status==404){
          this.router.navigate(['page-not-found'])
        }
      })
    })
  }
}
