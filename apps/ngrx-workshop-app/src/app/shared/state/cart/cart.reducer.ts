import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Item } from '@ngrx-workshop-app/api-interface';
import { enterCartPage, loadCartSuccess, loadCartFailure, addToCartSuccess, addToCartFailure, checkoutSuccess, checkoutFailure } from './cart.actions';
import { addToCart } from '../products/products.actions';

export interface State extends EntityState<Item>{
  loaded: boolean;
  error: string | null;
}

export const cartFeatureKey = 'cart';

export const adapter = createEntityAdapter<Item>({
  selectId: (item: Item) => item.itemId //indica que se tome item.itemId como ID
});

export const initialState: State = adapter.getInitialState({
  loaded: false,
  error: null
});

const cartReducer = createReducer(
  initialState,
  on(enterCartPage, addToCart, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(loadCartSuccess, addToCartSuccess, (state, { items }) =>
    adapter.addAll(items, {...state, loaded: true, error: null})
  ),
  on(loadCartFailure, addToCartFailure, checkoutFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(checkoutSuccess, (state) =>
    adapter.removeAll({...state, loaded: false, error: null})
  )
);

export function reducer(state: State | undefined, action: Action) {
  return cartReducer(state, action);
}
