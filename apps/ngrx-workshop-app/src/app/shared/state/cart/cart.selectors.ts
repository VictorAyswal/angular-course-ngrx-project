import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemWithProduct }  from '@ngrx-workshop-app/api-interface';

import * as fromCart from './cart.reducer';
import { getProductsEntities } from '../products';

const { selectAll, selectEntities } = fromCart.adapter.getSelectors();

const getCartState = createFeatureSelector<fromCart.State>(
    fromCart.cartFeatureKey
)

export const getCartLoaded = createSelector(
    getCartState,
    state => state.loaded
);

export const getCartError = createSelector(
    getCartState,
    state => state.error
);

export const getCartItemsInCart = createSelector(
    getCartState,
    state => selectAll(state)
);

export const getCartEntities = createSelector(
    getCartState,
    state => selectEntities(state)
);

export const getAllItemsInCartWithProduct = createSelector(
    getCartItemsInCart,
    getProductsEntities,
    (items, productEntities): ItemWithProduct[] =>
        items.map(item => ({ ...item, product: productEntities[item.productId] }))
);