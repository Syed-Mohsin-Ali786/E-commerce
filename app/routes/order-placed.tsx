import { assets } from "@/assets/assets";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const OrderPlaced = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-orders");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex justify-center items-center relative">
        <img className="absolute p-5" src={assets.checkmark} alt="" />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">
        Order Placed Successfully
      </div>
      <p className="text-gray-500 text-sm">Redirecting to your orders…</p>
    </div>
  );
};

export default OrderPlaced;
