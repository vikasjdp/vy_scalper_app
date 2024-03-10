import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center pt-24">
      <h2 className="text-3xl mb-6">Sign In</h2>
      <div className="w-96 bg-gray-800 p-4">
        <LoginForm />
      </div>
    </div>
  );
}
