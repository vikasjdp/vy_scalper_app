import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="flex flex-col items-center pt-24">
      <h2 className="text-3xl mb-6">Register</h2>
      <div className="w-96 bg-gray-800 p-4">
        <RegisterForm />
      </div>
    </div>
  );
}
