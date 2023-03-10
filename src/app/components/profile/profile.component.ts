import { Component } from '@angular/core';
import { ProfileService } from './profile.service';
import { Profile } from 'src/models/Profile';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ["./profile.component.css"],

    providers: [ProfileService]
})

export class ProfileComponent{ 
    public profile: Profile;

    public data : Date;
    monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    constructor(private profileService: ProfileService){
        this.profileService.get().subscribe(profile => 
            {
                this.profile = profile;
                this.data = new Date(this.profile.registratedAt);
            });     
    }  

    getRegisteredDate(){
        return this.monthNames[this.data.getMonth()] + ' ' + this.data.getFullYear()
    }

}

