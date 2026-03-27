import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;
  products: FavoriteType[] = [];
  cartItems: { [productId: string]: number } = {};
  serverStaticPath = environment.serverStaticPath;
  constructor(private favoriteService: FavoriteService, private cartService: CartService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];
      });

    this.loadCart();
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      });
}

  addToCart(productId: string) {
    this.cartService.updateCart(productId, 1)
    .subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.countInCart = this.count;
    })
  }

  loadCart() {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType)=> {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        (data as CartType).items.forEach((item) => {
          this.cartItems[item.product.id] = item.quantity;
        });
      })
  }

  updateCount(productId: string, newQuantity: number) {
    this.cartService.updateCart(productId, newQuantity)
      .subscribe((data: CartType | DefaultResponseType) => {
        if  ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cartItems[productId] = newQuantity;
      // if (!data.error) {
      //   if (newQuantity === 0) {
      //     delete this.cartItems[productId];
      //   } else {
      //     this.cartItems[productId] = newQuantity;
      //   }
      // }
    });
  }

}
