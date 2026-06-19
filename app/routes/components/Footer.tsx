import { Link } from "react-router";
import { assets } from "@/assets/assets";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Link to="/">
            <img className="w-28 md:w-32" src={assets.logo} alt="logo" />
          </Link>
          <p className="mt-6 text-sm">
            Your one-stop shop for electronics, accessories, and everyday tech.
            Browse curated products, secure checkout with cash on delivery, and
            fast order tracking — all in one place.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="/all-products">
                  Shop
                </Link>
              </li>
              <li>
                <Link className="hover:underline transition" to="/my-orders">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>Mon–Fri, 9am–6pm</p>
              <p>support@quickcart.store</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright {new Date().getFullYear()} © QuickCart. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
