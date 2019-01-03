import { Component, OnInit } from '@angular/core';

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(c => this.categories = c, e => alert('Erro ao carregar a lista!'))
  }

  deleteCategory(category: Category) {
    if(confirm('Deseja realmente excluir este item?')) {
    this.categoryService.delete(category.id)
      .subscribe(() => this.categories = this.categories.filter(e => e != category), 
        () => alert('Erro ao tentar excluir categoria!'));
    }
  }
}
