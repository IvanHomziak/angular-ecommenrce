import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import {ActivatedRoute, Routes} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private routes: ActivatedRoute) { }

  ngOnInit(): void {
    this.routes.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.routes.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  
  handleSearchProducts() {
    const theKeyword: string = this.routes.snapshot.paramMap.get('keyword')!;

    // now search for products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId = this.routes.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the "id" param string. convert to a number using  the "+" symbol
      this.currentCategoryId = +this.routes.snapshot.paramMap.get("id")!;
    } else {
      // not category id available  ... default to category id === 1
      this.currentCategoryId = 1;
    }

    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      })
  }
}
