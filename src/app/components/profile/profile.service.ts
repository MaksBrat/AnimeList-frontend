import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Profile} from '../../../entity/Profile';
import { ProfileWithAnimeList } from 'src/entity/ProfileWithAnimeList';

@Injectable()
export class ProfileService{
  
    constructor(private http: HttpClient){ }
    
    private url = 'https://localhost:7003/api/Profile';

    get(){
        return this.http.get<Profile>(this.url + '/get');
    }

    getProfileWithAnimeList(){
        return this.http.get<ProfileWithAnimeList>(this.url + '/getProfileWithAnimeList');
    }  
}