import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemWithProduct, Item }  from '@ngrx-workshop-app/api-interface';

import * as fromCart from './cart.reducer';
import { getProductsEntities } from '../products';
import { selectShippingCost } from '../shipping';

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

export const getCartTotal = createSelector(
    getAllItemsInCartWithProduct,
    (itemsWithProductdata: ItemWithProduct[]): number =>
        itemsWithProductdata.reduce((total, actual) => total + actual.product.price, 0)
);

export const getTotal = createSelector(
    getCartTotal,
    selectShippingCost,
    (cartTotal, shippingCost) => cartTotal + shippingCost
);

export const getCartInvalid = createSelector(
    getCartItemsInCart,
    (items: Item[]) => items.length === 0
);