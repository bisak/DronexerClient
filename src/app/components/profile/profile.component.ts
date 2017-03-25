import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service'
import { ActivatedRoute, Params, Router } from "@angular/router";
import 'rxjs/add/operator/switchMap';

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
        console.log(retrievedData)
        this.visualiseData = retrievedData.data
        this.visualiseData.profilePicture = `http://localhost:8080/api/users/profilePicture/${retrievedData.data.username}`
        console.log(this.visualiseData.profilePicture)
      }, (error) => {
        console.log("errored in profilecomponent: ")
        console.log(error)
      })
    })
  }
}
