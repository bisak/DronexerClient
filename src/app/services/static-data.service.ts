import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";

@Injectable()
export class StaticDataService {

  constructor(private apiService: ApiService) { }

  dronesArray = [
    "DJI Phantom 3 Std",
    "DJI Phantom 3 4K",
    "DJI Phantom 3 Adv",
    "DJI Phantom 3 Pro",
    "DJI Phantom 4",
    "DJI Phantom 4 Pro",
    "DJI Mavic Pro",
    "DJI Inspire 1",
    "DJI Inspire 2",
    "Other"
  ];

}
