import { Component} from '@angular/core';
import { ProfileService } from '../profile.service';
import { HttpClient } from '@angular/common/http';
import { ProfileResponseModel } from 'src/models/DTO/ResponseModels/ProfileResponseModel';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/Services/ImageService';
import { catchError, of, tap } from 'rxjs';
import { NotificationService } from 'src/app/Services/NotificationService';

@Component({
    selector: 'profileEdit',
    templateUrl: './profileEdit.component.html',
    styleUrls: ["../profile.component.css"],

    providers: [ProfileService]
})
export class ProfileEditComponent{
    public profileResponse: ProfileResponseModel;

    public avatar: File;
    public age: number;
    public name: string;

    public showMessage = false;
    public image: any;
    
    constructor(
        private profileService: ProfileService, 
        private http: HttpClient,
        public imageService: ImageService,
        public notificationService: NotificationService){
    }

    ngOnInit(){       
        this.profileService.get().subscribe(profile => 
        {   
            this.profileResponse = profile;
            this.age = profile.age;
            this.name = profile.name
        });         
    }

    ChangeAvatar(event: Event) {
        if(event.target instanceof HTMLInputElement){
            this.avatar = event.target.files![0];

            const formData = new FormData();     
            formData.append("Avatar", this.avatar);

            this.http.post<any>("https://localhost:7003/api/Profile/change-avatar", formData)
                .subscribe(response => { 
                    console.log(response);

                    window.location.reload();
                });
            
            this.showMessage = true;
        }
    }

    Edit(){
        const formData = new FormData();
        
        formData.append("Name", this.name);
        formData.append("Age", this.age.toString());

        this.http.post<any>("https://localhost:7003/api/Profile/edit", formData)
        .pipe(
            tap(response => {
                this.notificationService.addNotification({
                    message: 'Profile update successfully!',
                    type: 'success'
                });
            }),
            catchError(error => {
                this.notificationService.addNotification({
                    message: 'Error update profile',
                    type: 'error'
                });
                return of(error);
            })
        ).subscribe();            
    }
}