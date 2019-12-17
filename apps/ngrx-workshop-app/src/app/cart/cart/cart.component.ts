import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ItemWithProduct } from '@ngrx-workshop-app/api-interface';
import * as fromShipping from '@ngrx-workshop-app/shared/state/shipping';
import { enterCartPage } from '@ngrx-workshop-app/shared/state/cart/cart.actions';
import { getCartItemsInCart, getAllItemsInCartWithProduct, getCartTotal, getTotal, getCartInvalid } from '@ngrx-workshop-app/shared/state/cart/cart.selectors';
import { CartActions } from '@ngrx-workshop-app/shared/state/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  checkoutForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  });

  items$: Observable<ItemWithProduct[]> = this.store.pipe(
    select(getAllItemsInCartWithProduct)
  );
  shippingOptions$ = this.store.pipe(
    select(fromShipping.selectAllShippingOptions)
  );
  selectedMethod$ = this.store.pipe(
    select(fromShipping.selectSelectedShippingOption)
  );
  cartSubtotal$ = this.store.pipe(select(getCartTotal));
  shippingSubtotal$ = this.store.pipe(select(fromShipping.selectShippingCost));
  grandTotal$ = this.store.pipe(select(getTotal));
  shippingInvalid$ = this.store.pipe(select(fromShipping.getShippingInvalid));
  cartInvalid$ = this.store.pipe(select(getCartInvalid));

  shippingInfoInvalid$ = this.checkoutForm.statusChanges.pipe(
    map(x => x !== 'VALID'),
    startWith(true)
  );

  checkoutDisabled$: Observable<boolean> = combineLatest([
    this.shippingInvalid$,
    this.shippingInfoInvalid$,
    this.cartInvalid$
  ]).pipe(map(arr => arr.some(x => x === true)));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(
      enterCartPage()
    );
  }

  optionSelected(shippingMethod: string) {
    this.store.dispatch(CartActions.cartPageSelectShippingMethod({ shippingMethod }));
  }

  onSubmit() {
    this.checkoutForm.reset();
    this.store.dispatch(CartActions.checkout());
  }
}
