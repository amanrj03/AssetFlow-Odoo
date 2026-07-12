const Messages = {
  AUTH: {
    SIGNUP_SUCCESS: "Employee account created successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logged out successfully",
    UNAUTHORIZED: "Access denied. No token provided.",
    INVALID_TOKEN: "Access denied. Invalid or expired token.",
    NOT_FOUND: "User not found.",
    EMAIL_EXISTS: "Email address already registered.",
    EMPLOYEE_CODE_EXISTS: "Employee code already exists.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    FORBIDDEN: "You do not have permission to access this resource.",
  },
  VALIDATION: {
    INVALID_EMAIL: "Please enter a valid email address.",
    PASSWORD_MIN: "Password must be at least 6 characters long.",
    NAME_REQUIRED: "Name is required.",
    PHONE_INVALID: "Please enter a valid phone number.",
  },
};

module.exports = Messages;
