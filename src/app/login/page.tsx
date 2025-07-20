"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";  

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();
      
      if(!res.ok){
        setError(data.error || "Invalid credentials");
        return;
      }

      localStorage.setItem("habitnest_token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong, try again");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        />
        <input 
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
         className="w-full mb-6 px-4 py-2 rounded bg-gray-700 text-white"
         />

         {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
         )}

         <button 
         type="submit"
         disabled={loading}
         className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
