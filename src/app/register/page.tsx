"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  //form state to store username, email, password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //UI state for loading + error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //when the form is submitted
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "something went wrong");
        setLoading(false);
        return;
      }

      //save token and redirect
      localStorage.setItem("habitnest_token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError("something went wrong, try again!");
    } finally {
      setLoading(false);
    }
    console.log("📤 Sending:", { username, email, password });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handlesubmit}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/*Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 rounded bg-gray-700 text-white"
        />

        {/*email */}
        <input
        name="username"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        />

        {/*password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 rounded bg-gray-700 text-white"
        />

        {/*error meassge*/}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/*Submit button*/}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
