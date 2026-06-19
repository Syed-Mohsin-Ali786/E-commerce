import { Form, redirect, useActionData, useNavigation } from "react-router";
import {
  getOptionalUser,
  promoteToSeller,
  requireUserId,
} from "../.server/auth.server";
import type { Route } from "./+types/SignUp";

export async function loader(args: Route.LoaderArgs) {
  const user = await getOptionalUser(args);
  if (!user) {
    throw redirect("/");
  }
  if (user.role === "SELLER") {
    throw redirect("/seller");
  }
  return { user };
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireUserId(args);
  try {
    await promoteToSeller(args, userId);
    return redirect("/seller");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upgrade account.";
    return { error: message };
  }
}

export default function BecomeSeller() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg border p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">
            Become a Seller
          </h1>
          <p className="text-gray-500 mt-2">
            Upgrade your account to list products and manage orders on the
            seller dashboard.
          </p>
        </div>
        {actionData?.error && (
          <p className="text-red-600 text-sm">{actionData.error}</p>
        )}
        <Form method="post">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? "Upgrading…" : "Upgrade to Seller Account"}
          </button>
        </Form>
      </div>
    </div>
  );
}
