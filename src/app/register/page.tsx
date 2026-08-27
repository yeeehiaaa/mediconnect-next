import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-6 py-10">
      <div className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 shadow-2xl">
        <RegisterForm />
      </div>
    </main>
  );
}