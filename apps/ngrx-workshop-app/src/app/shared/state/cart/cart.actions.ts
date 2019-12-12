import { createAction, props } from '@ngrx/store';
import { Item } from '@ngrx-workshop-app/api-interface';

export const enterCartPage = createAction('[Cart Page] Enter');

export const loadCartSuccess = createAction(
    '[Cart Api] Load Cart Success',
    props<{ items: Item[] }>()
);
export const loadCartFailure = createAction(
    '[Cart Api] Load Cart Failure',
    props<{ error: any }>()
);
export const addToCartSuccess = createAction(
    '[Cart Api] Add to Cart Success',
    props<{ items: Item[] }>()
);
export const addToCartFailure = createAction(
    '[Cart Api] Add to Cart Failure',
    props<{ error: any }>()
);

export const cartPageSelectShippingMethod = createAction(
    '[Cart Page] Select Shipping Method',
    props<{ shippingMethod: string }>()
);