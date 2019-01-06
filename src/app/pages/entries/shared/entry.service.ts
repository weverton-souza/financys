import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { CategoryService } from "../../categories/shared/category.service";
import { Entry } from './entry.model';
import { flatMap, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super("api/entries", injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  /* A função desse método deveria realizada noservidor, mas neste caso está sendo usado o
   * in-memory.
  */
  getMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(e => this.filterByMonthAndYear(e, month, year))
    );
  }

  private filterByMonthAndYear(entry: Entry[], month: number, year: number) {
    return entry.filter(e => {
      const entryDate = moment(e.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() + 1;
      if(monthMatches && yearMatches) {
        return e;
      }
    })
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      catchError(this.handleError),
      flatMap(c => { 
        entry.category = c;
        return sendFn(entry);
    }));
  }
}
