import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { LogoAlternative } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="bg-(--background-light) flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center">
          <LogoAlternative />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
