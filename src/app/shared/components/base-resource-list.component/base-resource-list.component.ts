import { OnInit } from '@angular/core';

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

export abstract class BaseResourceList<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];
  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll()
      .subscribe(
        i => this.resources = i.sort((a, b) => b.id - a.id), 
        e => alert('Erro ao carregar a lista!'));
  }

  deleteResource(resource: T) {
    if(confirm('Deseja realmente excluir este item?')) {
    this.resourceService.delete(resource.id)
      .subscribe(() => this.resources = this.resources.filter(e => e != resource), 
        () => alert('Erro ao tentar excluir!'));
    }
  }
}
