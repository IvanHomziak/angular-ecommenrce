import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import {ProductCategory} from "../common/product-category";


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryURL = 'http://localhost:8080/api/product-category';
  private searchURL = 'http://localhost:8080/api/product-category';
  private productCategories: ProductCategory[] = [];

  constructor(private httpClient: HttpClient) { }

  getProductList(theCurrentId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCurrentId}`

    return this.getProducts(searchURL);
  }

  getProductCategories(): Observable<ProductCategory[]>  {
    const searchURL = `${this.categoryURL}`;
    return this.httpClient.get<GetResponseProductCategory>(searchURL).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword
    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchURL);
  }

  private getProducts(searchURL: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response._embedded.products)
    );
  }
}



interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
