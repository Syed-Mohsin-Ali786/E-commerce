import { Outlet } from "react-router";
import Navbar from "./components/seller/Navbar";
import Sidebar from "./components/seller/Sidebar";
import { requireSeller } from "../.server/auth.server";
import type { Route } from "./+types/seller";

export async function loader(args: Route.LoaderArgs) {
  const seller = await requireSeller(args);
  return { seller };
}

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
