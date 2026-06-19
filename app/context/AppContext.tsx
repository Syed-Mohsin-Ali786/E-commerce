import type { ClientProduct } from "../.server/product-mapper";
import type { CartItems } from "../.server/user.server";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useFetcher, useNavigate } from "react-router";
import { useUser } from "@clerk/react-router";
import type { UserResource } from "@clerk/types";

interface AppContextType {
  currency: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  isSeller: boolean;
  products: ClientProduct[];
  productsLoadError: string | null;
  cartItems: CartItems;
  setCartItems: (items: CartItems) => void;
  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
  user: UserResource | null | undefined;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

type AppContextProviderProps = {
  children: ReactNode;
  initialProducts: ClientProduct[];
  initialCartItems: CartItems;
  initialIsSeller: boolean;
  productsLoadError?: string | null;
};

export const AppContextProvider = ({
  children,
  initialProducts,
  initialCartItems,
  initialIsSeller,
  productsLoadError = null,
}: AppContextProviderProps) => {
  const currency = import.meta.env.VITE_PUBLIC_CURRENCY;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [products] = useState<ClientProduct[]>(initialProducts);
  const [isSeller] = useState<boolean>(initialIsSeller);
  const [cartItems, setCartItemsState] = useState<CartItems>(initialCartItems);

  const { user } = useUser();

  const persistCart = (items: CartItems) => {
    if (!user) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      fetcher.submit(
        { intent: "sync-cart", cartItems: JSON.stringify(items) },
        { method: "post", action: "/cart" },
      );
    }, 400);
  };

  const setCartItems = (items: CartItems) => {
    setCartItemsState(items);
    persistCart(items);
  };

  const addToCart = async (itemId: string) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] ?? 0) + 1;
    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    setCartItemsState(initialCartItems);
  }, [initialCartItems]);

  const value: AppContextType = {
    user,
    currency,
    navigate,
    isSeller,
    products,
    productsLoadError,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
