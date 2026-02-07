import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div  className="fixed inset-40 p-10 bg-white">
      <div className="w-full max-w-lg">
        <SignupForm />
      </div>
    </div>
  )
}
