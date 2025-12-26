import type { Route } from "./+types/home";
import Banner from "../components/Banner.js";
import FeaturedProduct from "../components/FeaturedProduct.js";
import Footer from "../components/Footer.js";
import HeaderSlider from "../components/HeaderSlider.js";
import HomeProducts from "../components/HomeProducts.js";
import Navbar from "../components";
import NewsLetter from "../components/NewsLetter.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
}
