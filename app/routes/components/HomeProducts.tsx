import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import { Link } from "react-router";
import EmptyState from "./EmptyState";

const HomeProducts = () => {
  const { products, productsLoadError } = useAppContext();

  if (productsLoadError) {
    return (
      <EmptyState
        title="Products unavailable"
        description={productsLoadError}
        actionLabel="Refresh page"
        actionTo="/"
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Check back soon — new items are on the way."
      />
    );
  }

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Link
        to="/all-products"
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </Link>
    </div>
  );
};

export default HomeProducts;
