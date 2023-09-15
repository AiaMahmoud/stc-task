import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products`);
  }
  getCategoryProducts(categoryName:string): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products/category/${categoryName}`);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(`https://fakestoreapi.com/products/categories`);
  }
  createProduct(model: Product) {
    return this.http.post<any>('https://fakestoreapi.com/products', model);
  }
  getProduct(id:any): Observable<any> {
    return this.http.get('users/api/v1/users',id);
  }
  deleteProduct(id:number):  Observable<any> {
    return this.http.delete('https://fakestoreapi.com/products/'+id);
  }
  updateProduct(id: number, model: Product) {
    return this.http.put<any>('https://fakestoreapi.com/products/'+id, model);
  }
}
