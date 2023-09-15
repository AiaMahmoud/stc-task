import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { MainComponent } from './main.component';
import { ProductsListModule } from '../products/products.module';
import { ProductsListComponent } from '../products/products-list/products-list.component';
import { ProductsTableComponent } from '../products/products-table/products-table.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: ProductsListComponent }
    ]
  },
  {
    path:'products',
    component: MainComponent,
    children: [
      { path: '', component: ProductsTableComponent }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
  constructor() {

  }
}
