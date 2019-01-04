import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";
import { CategoryService } from "../../categories/shared/category.service";
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath = "api/entries";
  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(flatMap(c => {
      entry.category = c;

      return this.http
        .post(this.apiPath, entry)
        .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
    }));
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.categoryService.getById(entry.categoryId).pipe(flatMap(c => {
      entry.category = c;

      return this.http
        .put(url, entry)
        .pipe(catchError(this.handleError), map(() => entry));
    }));
  }

  getAll(): Observable<Entry[]> {
    return this.http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  delete(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError), map(() => null));
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(e => {
      const entry = Object.assign(new Entry(), e);
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição -> ", error);
    return throwError(error);
  }
}
