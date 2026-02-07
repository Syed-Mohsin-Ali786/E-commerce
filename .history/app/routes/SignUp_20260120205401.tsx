import { SignupForm } from "@/components/signup-form"
import type { Route } from "./+types/test"

export async function action({request}:Route.ActionArgs){
  const formData= await request.formData();
  const name= await request.formData.name;
}

export default function Page() {

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <SignupForm />
      </div>
    </div>
  )
}
