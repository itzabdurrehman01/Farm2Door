import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'toggle': {
      const exists = state.items.find((i) => i.id === action.item.id);
      if (exists) {
        return { ...state, items: state.items.filter((i) => i.id !== action.item.id) };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'remove': {
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    }
    case 'clear': return { items: [] };
    default: return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] }, (initial) => {
    try {
      const local = localStorage.getItem('wishlist');
      return local ? JSON.parse(local) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state));
  }, [state]);

  const toggle = (item) => dispatch({ type: 'toggle', item });
  const remove = (id) => dispatch({ type: 'remove', id });
  const clear = () => dispatch({ type: 'clear' });
  const isInWishlist = (id) => state.items.some(i => i.id === id);

  return (
    <WishlistContext.Provider value={{ ...state, toggle, remove, clear, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }
