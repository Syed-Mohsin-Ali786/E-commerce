import ProductCard from "./components/ProductCard";
import EmptyState from "./components/EmptyState";
import { useAppContext } from "../context/AppContext";

const AllProducts = () => {
  const { products, productsLoadError } = useAppContext();

  return (
    <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
      <div className="flex flex-col items-end pt-12">
        <p className="text-2xl font-medium">All products</p>
        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
      </div>
      {productsLoadError ? (
        <EmptyState
          title="Products unavailable"
          description={productsLoadError}
          actionLabel="Go home"
          actionTo="/"
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="The catalog is empty. Sellers can add products from the dashboard."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
