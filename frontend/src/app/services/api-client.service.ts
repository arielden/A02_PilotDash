import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {

  private apiUrl = 'http://127.0.0.1:8000/poeassy/'; 

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}supplier/`);
  }

  getAssemblies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}assembly/`);
  }

  getAssembly(assemblyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}assembly/${assemblyId}`);
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}assembly/${endpoint}`, data);
  }
}