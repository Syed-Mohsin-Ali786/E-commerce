import { Form, redirect, useActionData, useNavigation } from "react-router";
import { assets } from "@/assets/assets";
import { useState } from "react";
import { uploadImages } from "../.server/cloudinary.server";
import { requireSeller } from "../.server/auth.server";
import { createProduct } from "../.server/product.server";
import type { Route } from "./+types/seller._index";

export async function action(args: Route.ActionArgs) {
  const seller = await requireSeller(args);
  const formData = await args.request.formData();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const offerPrice = Number(formData.get("offerPrice"));
  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!name || !description || !category) {
    return { error: "Please fill in all required fields." };
  }
  if (!price || !offerPrice || offerPrice > price) {
    return { error: "Enter valid price and offer price." };
  }

  try {
    const images = await uploadImages(imageFiles);
    await createProduct({
      name,
      description,
      category,
      price,
      offerPrice,
      images,
      sellerId: seller.id,
    });
    return redirect("/seller/product-list");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add product.";
    return { error: message };
  }
}

const AddProduct = () => {
  const [files, setFiles] = useState<(File | null)[]>([]);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <Form
        method="post"
        encType="multipart/form-data"
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {actionData?.error && (
          <p className="text-red-600 text-sm">{actionData.error}</p>
        )}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }
                  }}
                  type="file"
                  name="images"
                  accept="image/*"
                  id={`image${index}`}
                  hidden
                />
                <img
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index] as Blob)
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            name="description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            required
          />
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              defaultValue="Earphone"
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              name="price"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              name="offerPrice"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50"
        >
          {isSubmitting ? "Uploading…" : "ADD"}
        </button>
      </Form>
    </div>
  );
};

export default AddProduct;
