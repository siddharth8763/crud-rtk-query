import { useState } from "react";
import { useRegisterMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux/slices/AuthSlice";
import { useNavigate, Link } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
      if (res.accessToken) {
        dispatch(setAccessToken(res.accessToken));
        navigate("/"); // Redirect to home so user stays logged in
      }
    } catch {
      // Error handled below
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
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
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {typeof error === "object" &&
            error !== null &&
            "data" in error &&
            typeof (error as { data?: { message?: string } }).data?.message ===
              "string"
              ? (error as { data?: { message?: string } }).data!.message
              : "Registration failed"}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16 }}>
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export { Register };
