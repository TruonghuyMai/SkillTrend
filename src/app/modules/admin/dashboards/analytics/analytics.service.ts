import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AnalyticsService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _data2: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        console.log("call get data 1 ")

        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) =>
            {
                this._data.next(response);
            }),
        );
    }

    /**
     * Getter for data
     */
    get data2$(): Observable<any>
    {
        console.log("data2$")
        return this._data2.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData2(): Observable<any>
    {
        console.log("call get data 2 ")
        return this._httpClient.get('api/dashboards/finance').pipe(
            tap((response: any) =>
            {
                this._data2.next(response);
            }),
        );
    }

    getData3(): Observable<any>
    {
        console.log("call get data 3 ")

        const headers = new HttpHeaders()
            .set('Accept', 'application/json')
            .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjQ4YWI5NmU3ZGI3MzZlMjNhNjU4ZWMyIiwiZXhwIjoxNjg3MDM0OTIxLCJpYXQiOjE2ODcwMzMxMjEsImlzcyI6IjY0OGUxNTIxY2Y3NjA2MTdlMTdkODU0ZSIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY0OGFiOTZlN2RiNzM2ZTIzYTY1OGVjMiIsInN1YiI6IjY0OGFiOWFlNWRkYzRlMjhlZDUxOGYxMyIsInR5cCI6ImFjY2VzcyJ9.q8CxPpYU9xvxHCfEiX56b_UsSDwQ9CXioEFydxj-Fc8')

        const requestBody = {
            datasource: 'Cluster0',
            database: 'job',
            collection: 'job',
            filter: {}
        };

        return this._httpClient.post('https://us-east4.gcp.data.mongodb-api.com/app/data-gtnau/endpoint/data/v1/action/find',requestBody,{headers}).pipe(
            tap((response: any) =>
            {
                this._data2.next(response);
            }),
        );
    }

    getData4(): Observable<any>
    {
        console.log("call get data 4")

        let token = ""
        
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')

        const requestBody = {
            key: "yFM61Nysq5uhOs1hXU9C1khngWJuU5RBTAQbaEs1KKhF0uQKIOzLlkNG09Tw1KkW"
        };

        return this._httpClient.post('https://us-east4.gcp.realm.mongodb.com/api/client/v2.0/app/data-gtnau/auth/providers/api-key/login',requestBody,{headers}).pipe(
            tap((response: any) =>
            {
                token=response.access_token
                this._data2.next(response);
            }),
        );

         
    }



    
}
