import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#121212] shadow-lg border border-gray-800">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form className="space-y-4">
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Navigation */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}