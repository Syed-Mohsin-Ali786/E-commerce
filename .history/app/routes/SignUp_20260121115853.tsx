import { SignupForm } from "@/components/signup-form";
import type { Route } from "./+types/test";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // Getting the form data by name attribute
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  // Here you can handle the form data, e.g., save it to a database

  console.log(name, email, password, confirmPassword);
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <SignupForm />
      </div>
    </div>
  );
}
