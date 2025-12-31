import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

const CartContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'remove': {
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    }
    case 'qty': {
      return {
        ...state,
        items: state.items.map((i) => i.id === action.id ? { ...i, qty: action.qty } : i)
      };
    }
    case 'clear': return { items: [] };
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] }, (initial) => {
    try {
      const local = localStorage.getItem('cart');
      return local ? JSON.parse(local) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const add = (item) => dispatch({ type: 'add', item });
  const remove = (id) => dispatch({ type: 'remove', id });
  const setQty = (id, qty) => dispatch({ type: 'qty', id, qty });
  const clear = () => dispatch({ type: 'clear' });
  const total = state.items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  return (
    <CartContext.Provider value={{ ...state, add, remove, setQty, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }

