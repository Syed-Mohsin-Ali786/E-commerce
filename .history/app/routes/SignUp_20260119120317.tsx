import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex  min-h-svh w-full items-center justify-center md:p-10 fixed inset-40" >
      <div className="w-full max-w-lg">
        <SignupForm />
      </div>
    </div>
  )
}
