import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Anime} from '../../../models/Anime';
import { catchError, of, Subject, tap } from 'rxjs';
import { NotificationService } from 'src/app/services/NotificationService';
import { Router } from '@angular/router';
import { AnimeFilter } from 'src/models/Filter/AnimeFilter';
import { UrlOptions } from 'src/models/UrlOptions';

@Injectable({
    providedIn: 'root'
  })
export class AnimeService{
    anime: Anime;
    searchQuery: string;
    invokeEvent: Subject<any> = new Subject(); 

    currentPage: string;

    private animeUrl = UrlOptions.BaseUrl + 'api/Anime';
    
    constructor(private http: HttpClient, private notificationService: NotificationService){
        
    }
    
    getSearchQuery($event){
        this.invokeEvent.next($event.target.value);
    }

    get(id: number){
        return this.http.get(this.animeUrl + '/get/' + id);
    }

    getAll(filter: AnimeFilter){
        let params = new HttpParams()
            .set('searchQuery', filter.searchQuery || '')
            .set('animeType', filter.animeType || '')
            .set('animeStatus', filter.animeStatus || '')
            .set('OrderBy', filter.orderBy || '')
            .set('ascOrDesc', filter.ascOrDesc || '')
            .set('take', filter.take || 10);

            if(filter.genres){
                filter.genres.forEach((genre, index) => {
                    params = params.append(`genres[${index}].id`, genre.id);
                    params = params.append(`genres[${index}].name`, genre.name);
                    params = params.append(`genres[${index}].checked`, genre.checked);
                  });
            }

        return this.http.get<Anime[]>(this.animeUrl + '/getAll/?' + params);
    } 
    
    create(anime: Anime){
        return this.http.post<Anime>(this.animeUrl + '/create', anime)
            .pipe(
                tap(response => {
                    this.notificationService.addNotification({
                        message: 'Anime created successfully!',
                        type: 'success'
                    });
                }),
                catchError(error => {
                    this.notificationService.addNotification({
                        message: 'Error creating anime',
                        type: 'error'
                    });
                    return of(error);
                })
            ).subscribe();
    }

    update(anime: Anime){
        return this.http.post<Anime>(this.animeUrl + '/edit', anime)
        .pipe(
            tap(response => {
                this.notificationService.addNotification({
                    message: 'Anime updated successfully!',
                    type: 'success'
                });
            }),
            catchError(error => {
                this.notificationService.addNotification({
                    message: 'Error updating anime',
                    type: 'error'
                });
                return of(error);
            })
        ).subscribe();
    }

    delete(id: number){
        return this.http.delete(this.animeUrl + '/delete/' + id)
        .pipe(
            tap(response => {
                this.notificationService.addNotification({
                    message: 'Anime delete successfully!',
                    type: 'success'
                });
            }),
            catchError(error => {
                this.notificationService.addNotification({
                    message: 'Error delete anime',
                    type: 'error'
                });
                return of(error);
            })
        ).subscribe();
    }
}