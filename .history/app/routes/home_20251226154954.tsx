import type { Route } from "./+types/home";
import Banner from "./components/Banner.jsx";
import FeaturedProduct from "./components/FeaturedProduct.jsx";
import Footer from "./components/Footer.jsx";
import HeaderSlider from "./components/HeaderSlider.jsx";
import HomeProducts from "./components/HomeProducts.jsx";
import Navbar from "./components/";
import NewsLetter from "./components/NewsLetter.jsx";

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
