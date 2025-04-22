import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/signup.module.scss";
import Header from "@/components/homePage/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isUsernameValid && isEmailValid && isPasswordValid);
  }, [username, email, password]);

  const validateUsername = (name) => {
    const usernameRegex = /^[^\s]{8,}$/;
    if (!name) {
      setUsernameError("Username is required");
      return false;
    } else if (!usernameRegex.test(name)) {
      setUsernameError("Username must be at least 8 characters with no spaces");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[^\s]{8,}$/;
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters with 1 uppercase letter, 1 number, 1 special character, and no spaces"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleBlur = (field) => {
    setTouchedFields({
      ...touchedFields,
      [field]: true,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setTouchedFields({
      username: true,
      email: true,
      password: true,
    });

    setSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          (data.errors && data.errors[0]?.msg) ||
          "Registration failed";
        setSubmitError(errorMessage);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      login(data.user);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError("Network error. Please try again later.");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className={`${styles.card} shadow`}>
            <div className="card-body p-4">
              <h2 className={`${styles.authHeader} text-center mb-4 `}>
                Sign Up
              </h2>

              {submitError && (
                <div className="alert alert-danger" role="alert">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      touchedFields.username && usernameError
                        ? "is-invalid"
                        : ""
                    }`}
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    onBlur={() => handleBlur("username")}
                    placeholder="Enter username"
                  />
                  {touchedFields.username && usernameError && (
                    <div className="invalid-feedback">{usernameError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      touchedFields.email && emailError ? "is-invalid" : ""
                    }`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter your email"
                  />
                  {touchedFields.email && emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className={`form-control ${
                        touchedFields.password && passwordError
                          ? "is-invalid"
                          : ""
                      }`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Enter your password"
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                      {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                  {touchedFields.password && passwordError && (
                    <div className="invalid-feedback d-block">
                      {passwordError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.signInButton}
                  disabled={!isFormValid}
                >
                  Sign Up
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/signin">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
