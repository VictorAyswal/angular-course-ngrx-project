import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CartService } from '@ngrx-workshop-app/cart-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import * as AppActions from '../app/app.actions';
import * as ProductActions from '../products/products.actions';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.enterCartPage, AppActions.init),
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
      ofType(ProductActions.addToCart),
      concatMap(({ productId }) =>
        this.cartService.addToCart(productId).pipe(
          map(items => CartActions.addToCartSuccess({ items })),
          catchError(() =>
            of(
              CartActions.addToCartFailure({
                error: 'Unable to add item to cart'
              })
            )
          )
        )
      )
    )
  );

  checkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.checkout),
      concatMap(() =>
        this.cartService.checkout().pipe(
          map(items => CartActions.checkoutSuccess({ items })),
          catchError(() =>
            of(
              CartActions.checkoutFailure({
                error: 'Unable to checkout'
              })
            )
          )
        )
      )
    )
  );

  navigateToProductsPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addToCartSuccess, CartActions.checkoutSuccess),
        tap(() => this.router.navigateByUrl('/'))
      ),
    { dispatch: false }
  );

  showAddToCartSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addToCartSuccess),
        tap(() =>
          this.snackBar.open(
            'Your product has been added to the cart!',
            undefined,
            {
              duration: 2000
            }
          )
        )
      ),
    { dispatch: false }
  );

  showCheckoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.checkoutSuccess),
        tap(() =>
          this.snackBar.open(
            'Checkout has been successfully completed.',
            undefined,
            {
              duration: 2000
            }
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
}
