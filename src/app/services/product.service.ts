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

  getProduct(theProductId: number) {
    const productURL = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productURL);
  }

  getProductList(theCurrentId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCurrentId}`

    return this.getProducts(searchURL);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchURL);
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

  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size
    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchURL);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
