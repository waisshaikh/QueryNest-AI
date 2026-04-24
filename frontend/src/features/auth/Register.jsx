import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#121212] shadow-lg border border-gray-800">

        <h2 className="text-2xl font-bold text-center mb-6">
          Register
        </h2>

        <form className="space-y-4">

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

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
            Register
          </button>
        </form>

        {/* Navigation */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}