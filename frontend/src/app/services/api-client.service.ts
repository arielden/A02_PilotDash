import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl = '/poeassy/assembly/'; // URL base de la API, ruta relativa.

  constructor(private http: HttpClient) {}

  getAssemblies(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getAssembly(assemblyId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${assemblyId}`);
  }
}

//nuevo