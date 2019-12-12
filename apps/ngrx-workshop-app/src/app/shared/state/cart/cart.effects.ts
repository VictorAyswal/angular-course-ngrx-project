import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CartService } from '@ngrx-workshop-app/cart-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, concatMap } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { addToCart } from '../products/products.actions';
import { Item } from '@ngrx-workshop-app/api-interface';

@Injectable()
export class CartEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.enterCartPage),
      exhaustMap(() =>
        this.cartService.getItems().pipe(
          map(items => CartActions.loadCartSuccess({ items })),
          catchError(() =>
            of(
              CartActions.loadCartFailure({
                error: 'Unable to load cart'
              })
            )
          )
        )
      )
    )
  );
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      concatMap(({ productId }) =>
        this.cartService.addToCart(productId).pipe(
          map((items: Item[]) => CartActions.addToCartSuccess({ items })),
          catchError(() =>
            of(CartActions.addToCartFailure({ error: 'Unable to add item to cart' }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
}
