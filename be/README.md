# Papuncb Backend

This is the backend API for the Papuncb application, built with Node.js, Express, and MongoDB. It provides authentication, user management, and item management features.

## Features

- **User Registration**: New users can register with a username, email, and password.
- **User Login**: Registered users can log in with email and password to receive an access token and refresh token.
- **JWT Authentication**: Uses JSON Web Tokens for secure authentication and session management.
- **Refresh Token Flow**: Supports access token renewal using refresh tokens (via cookie or Authorization header).
- **Logout**: Users can log out, which invalidates their refresh token and clears the cookie.
- **Password Reset**: Users can request a password reset token and reset their password securely.
- **Item Management**: (Assumed from `itemController.js` and `itemRoutes.js`) Users can manage items (CRUD operations).

## Key Concepts & Code Snippets

### 1. User Registration
```js
// Register a new user
export async function register(req, res) {
  // ...existing code...
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  // ...existing code...
}
```

### 2. User Login & JWT Token Generation
```js
// Login a user
export async function login(req, res) {
  // ...existing code...
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = crypto.randomBytes(32).toString("hex");
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ accessToken: token });
  // ...existing code...
}
```

### 3. Refresh Token Flow
```js
// Helper to get refresh token from cookie or Authorization header
function getRefreshToken(req) {
  if (req.cookies && req.cookies.refreshToken) return req.cookies.refreshToken;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Refresh access token
export async function refresh(req, res) {
  const refreshToken = getRefreshToken(req);
  // ...existing code...
}
```

### 4. Logout
```js
// Logout a user
export async function logout(req, res) {
  const refreshToken = getRefreshToken(req);
  // ...existing code...
  user.refreshToken = undefined;
  await user.save();
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.json({ message: "Logged out successfully" });
}
```

### 5. Password Reset
```js
// Forgot password
export async function forgotPassword(req, res) {
  // ...existing code...
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiration = Date.now() + 3600000;
  await user.save();
  res.json({ resetToken });
}

// Reset password
export async function resetPassword(req, res) {
  // ...existing code...
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiration = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
}
```

### 6. Middleware & Security
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT creation and verification
- **crypto** for secure token generation
- **httpOnly cookies** for refresh token storage

### 7. Item Management (CRUD)
- See `itemController.js` and `itemRoutes.js` for endpoints to create, read, update, and delete items.

## Project Structure
```
Config/
  db.js
Controllers/
  authController.js
  itemController.js
Middlewares/
  authMiddleware.js
Models/
  User.js
  Item.js
Routes/
  authRoutes.js
  itemRoutes.js
server.js
```

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.example` if available)
3. Start the server: `npm start`

---

**Papuncb Backend** provides a secure, modern authentication and item management API for your application.
