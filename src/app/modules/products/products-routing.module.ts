import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsTableComponent } from './products-table/products-table.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
  constructor() {
    if (localStorage.getItem('user') && localStorage.getItem('user') == 'user') {
    }

  }
}
