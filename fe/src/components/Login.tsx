import { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux/slices/AuthSlice";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      if (res.accessToken) {
        dispatch(setAccessToken(res.accessToken));
        navigate("/");
      }
    } catch {
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {typeof error === "object" &&
            error !== null &&
            "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message ===
              "string"
              ? (error as { data?: { message?: string } }).data!.message
              : "Login failed"}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16 }}>
        <span>Don't have an account? </span>
        <Link to="/register">Register</Link>
      </div>
      <div style={{ marginTop: 8 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};

export { Login };
