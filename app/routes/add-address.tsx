import { Form, redirect, useActionData } from "react-router";
import { createAddress } from "../.server/address.server";
import { requireUserId } from "../.server/auth.server";
import type { Route } from "./+types/add-address";

export async function action(args: Route.ActionArgs) {
  const userId = await requireUserId(args);
  const formData = await args.request.formData();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const pincode = String(formData.get("pincode") ?? "").trim();

  if (!fullName || !phoneNumber || !area || !city || !state) {
    return { error: "Please fill in all required fields." };
  }

  await createAddress(userId, {
    fullName,
    phoneNumber,
    area,
    city,
    state,
    pincode: pincode || undefined,
  });

  return redirect("/cart");
}

export default function AddAddress() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-32 py-14">
      <div className="w-full max-w-lg border p-6 md:p-8">
        <h1 className="text-2xl font-medium text-gray-700 mb-6">Add New Address</h1>
        {actionData?.error && (
          <p className="text-red-600 text-sm mb-4">{actionData.error}</p>
        )}
        <Form method="post" className="space-y-4">
          <input
            name="fullName"
            placeholder="Full name"
            required
            className="w-full border p-2.5 outline-none"
          />
          <input
            name="phoneNumber"
            placeholder="Phone number"
            required
            className="w-full border p-2.5 outline-none"
          />
          <input
            name="area"
            placeholder="Area / Street"
            required
            className="w-full border p-2.5 outline-none"
          />
          <input
            name="city"
            placeholder="City"
            required
            className="w-full border p-2.5 outline-none"
          />
          <input
            name="state"
            placeholder="State"
            required
            className="w-full border p-2.5 outline-none"
          />
          <input
            name="pincode"
            placeholder="Pincode (optional)"
            className="w-full border p-2.5 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 hover:bg-orange-700"
          >
            Save Address
          </button>
        </Form>
      </div>
    </div>
  );
}
