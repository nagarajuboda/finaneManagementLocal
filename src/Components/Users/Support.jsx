// import "../../assets/Styles/Support.css";
// import { useEffect, useState } from "react";
// export default function Support() {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [user, setuser] = useState({});
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("sessionData"));
//     setuser(data);
//     setSelectedRole(data.employee.role.name);
//   }, []);

//   const handleRoleChange = (e) => {
//     setSelectedRole(e.target.value);
//   };
//   return (
//     <div className="support-main-div">
//       <div className="support-page-container">
//         <h2>Raise a Support Request</h2>

//         {/* User Role Selection */}
//         <div className="form-group">
//           <label>
//             User Role <span style={{ color: "red" }}>*</span>
//           </label>
//           <select
//             name="role"
//             className="form-control"
//             onChange={handleRoleChange}
//           >
//             <option value="">-- Select Role --</option>
//             <option value="Admin">Admin</option>
//             <option value="ProjectManager">Project Manager</option>
//             <option value="USFinance">US-Finance Team</option>
//             <option value="IndianFinance">Indian-Finance Team</option>
//           </select>
//         </div>

//         {/* Issue Category (dynamic based on role) */}
//         <div className="form-group">
//           <label>
//             Issue Category <span style={{ color: "red" }}>*</span>
//           </label>
//           <select name="category" className="form-control">
//             <option value="">-- Select Category --</option>

//             {/* Admin Categories */}
//             {selectedRole === "Admin" && (
//               <>
//                 <option value="UserRoleIssue">User/Role Management</option>
//                 <option value="ProjectAssign">Project Assignment</option>
//                 <option value="DashboardError">Dashboard Loading Issue</option>
//                 <option value="SystemBug">System Bug / Crash</option>
//               </>
//             )}

//             {/* Project Manager Categories */}
//             {selectedRole === "ProjectManager" && (
//               <>
//                 <option value="WorkingHours">Can't log working hours</option>
//                 <option value="Timesheet">Timesheet not saving</option>
//                 <option value="AccessDenied">Access Denied</option>
//               </>
//             )}

//             {/* US Finance Categories */}
//             {selectedRole === "USFinance" && (
//               <>
//                 <option value="RevenueEntry">Revenue entry not saving</option>
//                 <option value="RevenueMismatch">Mismatch in revenue</option>
//                 <option value="DashboardIssue">Dashboard not loading</option>
//               </>
//             )}

//             {/* Indian Finance Categories */}
//             {selectedRole === "IndianFinance" && (
//               <>
//                 <option value="ExpenseEntry">Expense not saving</option>
//                 <option value="ExpenseMismatch">Mismatch in expenses</option>
//                 <option value="FinalCalculation">
//                   Profit/Loss not showing
//                 </option>
//               </>
//             )}
//           </select>
//         </div>

//         {/* Description Field */}
//         <div className="form-group">
//           <label>
//             Description <span style={{ color: "red" }}>*</span>
//           </label>
//           <textarea
//             name="description"
//             className="form-control"
//             rows="4"
//             placeholder="Clearly explain your issue..."
//           ></textarea>
//         </div>

//         {/* Optional Screenshot */}
//         <div className="form-group">
//           <label>Attach Screenshot (optional)</label>
//           <input type="file" className="form-control" />
//         </div>

//         {/* Support Contact Section */}
//         {selectedRole && (
//           <div className="contact-info-box">
//             <h4>Support Contact Info</h4>
//             {selectedRole === "Admin" && (
//               <>
//                 <p>
//                   <strong>Contact:</strong> +91 98765 43210
//                 </p>
//                 <p>
//                   <strong>Email:</strong> admin-support@yourcompany.com
//                 </p>
//               </>
//             )}
//             {selectedRole === "Project Manager" && (
//               <>
//                 <p>
//                   <strong>Contact:</strong> +91 91234 56789
//                 </p>
//                 <p>
//                   <strong>Email:</strong> pm-support@yourcompany.com
//                 </p>
//               </>
//             )}
//             {selectedRole === "US-finance" && (
//               <>
//                 <p>
//                   <strong>Contact:</strong> +1 212-456-7890
//                 </p>
//                 <p>
//                   <strong>Email:</strong> us-finance-support@yourcompany.com
//                 </p>
//               </>
//             )}
//             {selectedRole === "Indian-finance" && (
//               <>
//                 <p>
//                   <strong>Contact:</strong> +91 99887 76655
//                 </p>
//                 <p>
//                   <strong>Email:</strong> in-finance-support@yourcompany.com
//                 </p>
//               </>
//             )}
//           </div>
//         )}

//         {/* Submit Buttons */}
//         <div className="form-actions">
//           <button type="submit" className="btn-submit">
//             Submit
//           </button>
//           <button type="reset" className="btn-cancel">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import "../../assets/Styles/Support.css";
import { useEffect, useState } from "react";

export default function Support() {
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sessionData"));
    setUser(data);
    setSelectedRole(data?.employee?.role?.name || "");
  }, []);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call logic here
    alert("Support request submitted!");
  };

  return (
    <div className="support-main-div">
      <div className="support-page-container">
        <h2>Raise a Support Request</h2>

        <form onSubmit={handleSubmit}>
          {/* User Role Selection */}
          <div className="form-group">
            <label>
              User Role <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="role"
              className="form-control"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
              <option value="ProjectManager">Project Manager</option>
              <option value="USFinance">USFinance</option>
              <option value="IndianFinance">IndianFinance</option>
            </select>
          </div>

          {/* Issue Category */}
          <div className="form-group">
            <label>
              Issue Category <span style={{ color: "red" }}>*</span>
            </label>
            <select name="category" className="form-control" required>
              <option value="">-- Select Category --</option>

              {/* Admin */}
              {selectedRole === "Admin" && (
                <>
                  <option value="UserRoleIssue">User/Role Management</option>
                  <option value="ProjectAssign">Project Assignment</option>
                  <option value="DashboardError">
                    Dashboard Loading Issue
                  </option>
                  <option value="SystemBug">System Bug / Crash</option>
                </>
              )}

              {/* Project Manager */}
              {selectedRole === "ProjectManager" && (
                <>
                  <option value="WorkingHours">Can't log working hours</option>
                  <option value="Timesheet">Timesheet not saving</option>
                  <option value="AccessDenied">Access Denied</option>
                </>
              )}

              {/* US Finance */}
              {selectedRole === "USFinance" && (
                <>
                  <option value="RevenueEntry">Revenue entry not saving</option>
                  <option value="RevenueMismatch">Mismatch in revenue</option>
                  <option value="DashboardIssue">Dashboard not loading</option>
                </>
              )}

              {/* Indian Finance */}
              {selectedRole === "IndianFinance" && (
                <>
                  <option value="ExpenseEntry">Expense not saving</option>
                  <option value="ExpenseMismatch">Mismatch in expenses</option>
                  <option value="FinalCalculation">
                    Profit/Loss not showing
                  </option>
                </>
              )}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>
              Description <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Clearly explain your issue..."
              required
            ></textarea>
          </div>

          {/* Optional Screenshot */}
          <div className="form-group">
            <label>Attach Screenshot (optional)</label>
            <input type="file" className="form-control" />
          </div>

          {/* Role-based Contact Info */}
          {selectedRole && (
            <div className="contact-info-box">
              <h4>Support Contact Info</h4>
              {selectedRole === "Admin" && (
                <>
                  <p>
                    <strong>Contact:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Email:</strong> admin-support@yourcompany.com
                  </p>
                </>
              )}
              {selectedRole === "ProjectManager" && (
                <>
                  <p>
                    <strong>Contact:</strong> +91 91234 56789
                  </p>
                  <p>
                    <strong>Email:</strong> pm-support@yourcompany.com
                  </p>
                </>
              )}
              {selectedRole === "USFinance" && (
                <>
                  <p>
                    <strong>Contact:</strong> +1 212-456-7890
                  </p>
                  <p>
                    <strong>Email:</strong> us-finance-support@yourcompany.com
                  </p>
                </>
              )}
              {selectedRole === "IndianFinance" && (
                <>
                  <p>
                    <strong>Contact:</strong> +91 99887 76655
                  </p>
                  <p>
                    <strong>Email:</strong> in-finance-support@yourcompany.com
                  </p>
                </>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Submit
            </button>
            <button type="reset" className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
