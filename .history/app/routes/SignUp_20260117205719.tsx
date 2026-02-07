import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex min-h-1/2 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
