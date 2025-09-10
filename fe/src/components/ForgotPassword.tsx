import React, { useState } from "react";
import { useResetPasswordRequestMutation } from "../api/authApi";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resetPasswordRequest, { isLoading, isSuccess, error }] = useResetPasswordRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPasswordRequest({ email });
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        {isSuccess && <div style={{ color: "green", marginTop: 10 }}>If this email exists, a reset link has been sent.</div>}
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {typeof error === "object" && error !== null && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
              ? (error as { data?: { message?: string } }).data!.message
              : "Failed to send reset link"}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16 }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export { ForgotPassword };
