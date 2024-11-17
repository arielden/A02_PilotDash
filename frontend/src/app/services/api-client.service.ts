import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {

  private apiUrl = 'http://127.0.0.1:8000/poeassy/assembly/'; 

  constructor(private http: HttpClient) {}

  getAssemblies(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAssembly(assemblyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${assemblyId}`);
  }
}