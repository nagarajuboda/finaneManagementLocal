export const ChangePasswordValidation = (name, value, allValues) => {
  if (name === "password") {
    if (!value) return "Old password is required";
  }

  if (name === "newPassword") {
    if (!value) return "New password is required";
  }

  if (name === "confirmPassword") {
    if (!value) return "Confirm password is required";
    if (value !== allValues.newPassword) return "Passwords do not match";
  }

  return "";
};
