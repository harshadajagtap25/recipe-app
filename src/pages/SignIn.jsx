import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/signup.module.scss";
import Header from "@/components/homePage/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
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
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

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
    if (!password) {
      setPasswordError("Password is required");
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

  const handleSignIn = async (e) => {
    e.preventDefault();

    setTouchedFields({
      email: true,
      password: true,
    });

    setSubmitError("");

    try {
      const response = await fetch(
        "https://backend-fridgerecipe.onrender.com/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          (data.errors && data.errors[0]?.msg) ||
          "Invalid credentials";
        setSubmitError(errorMessage);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      login(data.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
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
                Sign In
              </h2>

              {submitError && (
                <div className="alert alert-danger" role="alert">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSignIn}>
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
                  Sign In
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
