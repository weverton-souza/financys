import { Component, OnInit } from '@angular/core';

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];
  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll()
      .subscribe(
        i => this.entries = i.sort((a, b) => b.id - a.id), 
        e => alert('Erro ao carregar a lista!'));
  }

  deleteEntry(entry: Entry) {
    if(confirm('Deseja realmente excluir este item?')) {
    this.entryService.delete(entry.id)
      .subscribe(() => this.entries = this.entries.filter(e => e != entry), 
        () => alert('Erro ao tentar excluir categoria!'));
    }
  }
}
