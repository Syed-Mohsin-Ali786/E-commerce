import { productsDummyData, userDummyData } from "@/assets/dummyData";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router"; // Replaced next/navigation

// --- TypeScript Interfaces ---
interface Product {
  _id: string;
  offerPrice: number;
  name: string;
  image:string[];
  // Add other properties based on your dummy data
}

interface UserData {
  name: string;
  email: string;
  // Add other properties
}

interface CartItems {
  [itemId: string]: number;
}

interface AppContextType {
  currency: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  isSeller: boolean;
  setIsSeller: (value: boolean) => void;
  userData: UserData | boolean;
  fetchUserData: () => Promise<void>;
  products: Product[];
  fetchProductData: () => Promise<void>;
  cartItems: CartItems;
  setCartItems: (items: CartItems) => void;
  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
}

// --- Context Logic ---

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // In React Router, we use import.meta.env for environment variables (Vite)
  const currency = import.meta.env.VITE_PUBLIC_CURRENCY; 
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<UserData | boolean>(false);
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItems>({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
  };

  const addToCart = async (itemId: string) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    let cartData = structuredClone(cartItems);
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
    fetchProductData();
    fetchUserData();
  }, []);

  const value: AppContextType = {
    currency,
    navigate,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};