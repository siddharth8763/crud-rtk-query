import React, { useState } from "react";
import { useResetPasswordMutation } from "../api/authApi";
import { useSearchParams, Link } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  const [submitted, setSubmitted] = useState(false);
  const [missingToken, setMissingToken] = useState(false);

  React.useEffect(() => {
    if (!token) {
      setMissingToken(true);
    } else {
      setMissingToken(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMissingToken(true);
      return;
    }
    if (password !== confirmPassword) {
      setSubmitted(true);
      return;
    }
    await resetPassword({ resetToken: token, newPassword: password });
    setSubmitted(false);
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {missingToken && (
          <div style={{ color: "red", marginBottom: 10 }}>
            Reset token is missing. Please use the link from your email.
          </div>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        {submitted && password !== confirmPassword && (
          <div style={{ color: "red", marginBottom: 10 }}>Passwords do not match.</div>
        )}
        <button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
        {isSuccess && <div style={{ color: "green", marginTop: 10 }}>Password reset successful! <Link to="/login">Login</Link></div>}
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {typeof error === "object" && error !== null && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
              ? (error as { data?: { message?: string } }).data!.message
              : "Failed to reset password"}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16 }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export { ResetPassword };
