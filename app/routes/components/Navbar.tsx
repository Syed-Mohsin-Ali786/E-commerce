import { Link } from "react-router";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import { useClerk, UserButton } from "@clerk/react-router";
import { BagIcon, BoxIcon, CartIcon, HomeIcon } from "./Icons";

export default function Navbar() {
  const { openSignIn } = useClerk();
  const { isSeller, user, navigate, getCartCount } = useAppContext();
  const cartCount = getCartCount();

  const handleLogin = () => {
    openSignIn();
  };

  const handleBecomeSeller = () => {
    if (!user) {
      openSignIn({ redirectUrl: "/SignUp" });
      return;
    }
    navigate("/SignUp");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Link to="/">
        <img
          className="cursor-pointer w-28 md:w-32"
          src={assets.logo}
          alt="logo"
        />
      </Link>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link to="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link to="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>

        {isSeller ? (
          <Link
            to="/seller"
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBecomeSeller}
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50"
          >
            Become a Seller
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <img className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <Link
          to="/cart"
          className="relative hover:opacity-80 transition"
          aria-label={`Cart, ${cartCount} items`}
        >
          <img className="w-5 h-5" src={assets.cart_icon} alt="cart icon" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-medium leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => navigate("/cart")}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => navigate("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 hover:text-gray-900 transition hover:cursor-pointer"
            onClick={handleLogin}
          >
            <img src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        <Link
          to="/cart"
          className="relative"
          aria-label={`Cart, ${cartCount} items`}
        >
          <img className="w-5 h-5" src={assets.cart_icon} alt="cart icon" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-medium leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        {isSeller ? (
          <Link
            to="/seller"
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBecomeSeller}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Sell
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => navigate("/")}
              />
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => navigate("/all-products")}
              />
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => navigate("/cart")}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => navigate("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 hover:text-gray-900 transition hover:cursor-pointer"
            onClick={handleLogin}
          >
            <img src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
}
