import React, { useState } from "react";

const roles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Project Manager" },
  { id: "3", name: "Developer" },
];

const projectManagers = [
  { id: "101", name: "Alice Johnson" },
  { id: "102", name: "Bob Smith" },
];

const EmployeeStateOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "block",
    padding: "40px 80px",
    background: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    maxWidth: 650,
    width: "100%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: 28,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#333",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 5,
    fontSize: 16,
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 5,
    fontSize: 16,
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px 22px",
    fontSize: 16,
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
};

function ProfilePage() {
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dateOfJoining: "",
    dateOfReliving: "",
    employeeStatus: "Active",
    skillSets: "",
    roleId: "",
    projectManagerId: "",
  });

  const [errors, setErrors] = useState({});

  // Simple form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.dateOfJoining)
      newErrors.dateOfJoining = "Date of Joining required";
    if (!formData.roleId) newErrors.roleId = "Role selection is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit API logic here
    alert("Profile saved successfully!");
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Employee Profile</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="employeeId">
              Employee ID *
            </label>
            <input
              style={styles.input}
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
            {errors.employeeId && (
              <div style={styles.errorText}>{errors.employeeId}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="firstName">
              First Name *
            </label>
            <input
              style={styles.input}
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <div style={styles.errorText}>{errors.firstName}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="lastName">
              Last Name
            </label>
            <input
              style={styles.input}
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email *
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div style={styles.errorText}>{errors.email}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="mobileNo">
              Mobile No
            </label>
            <input
              style={styles.input}
              type="tel"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="+91-XXXXXXXXXX"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="dateOfJoining">
              Date of Joining *
            </label>
            <input
              style={styles.input}
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
            />
            {errors.dateOfJoining && (
              <div style={styles.errorText}>{errors.dateOfJoining}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="dateOfReliving">
              Date of Relieving
            </label>
            <input
              style={styles.input}
              type="date"
              id="dateOfReliving"
              name="dateOfReliving"
              value={formData.dateOfReliving}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="employeeStatus">
              Employee Status *
            </label>
            <select
              style={styles.select}
              id="employeeStatus"
              name="employeeStatus"
              value={formData.employeeStatus}
              onChange={handleChange}
            >
              {EmployeeStateOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="skillSets">
              Skill Sets
            </label>
            <textarea
              style={{ ...styles.input, height: 80 }}
              id="skillSets"
              name="skillSets"
              value={formData.skillSets}
              onChange={handleChange}
              placeholder="Comma separated skills"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="roleId">
              Role *
            </label>
            <select
              style={styles.select}
              id="roleId"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <div style={styles.errorText}>{errors.roleId}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="projectManagerId">
              Project Manager
            </label>
            <select
              style={styles.select}
              id="projectManagerId"
              name="projectManagerId"
              value={formData.projectManagerId}
              onChange={handleChange}
            >
              <option value="">-- Select Project Manager --</option>
              {projectManagers.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
