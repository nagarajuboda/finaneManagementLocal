import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar";
import AddProject from "../Components/Admin/Pages/AddProject";
import { ViewProject } from "../Components/Admin/ViewProject";
import Roles from "../Components/Employee/Roles";
import EmployeeDetails from "../Components/Employee/EmployeeDetails";
import AddRevenue from "../Components/USFinance/AddRevenue";
import Employees from "../Components/Employee/Employees";
import AddEmployee from "../Components/Employee/AddEmployee";
import Projectss from "../Components/Admin/Pages/Projects";
import EditEmployeePopup from "../Components/Employee/EditEmployeePopup";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import Employeess from "../Components/Manager/Employees";
import ManagerDashboard from "../Components/Manager/ManagerDashboard";
import ProjectManagerProjects from "../Components/Manager/ProjectManagerProjects";
import TimeSheetModule from "../Components/Manager/TimeSheet";
import UsFinanceTeamDashboard from "../Components/USFinance/Dashboard";
import USFinanceTeamAllProjects from "../Components/USFinance/AllProjects";
import Notifications from "../Components/Admin/Notifications";
import IndianFinanceTeamDashboard from "../Components/IndianFinance/Dashboard";
import ListOfEmployees from "../Components/IndianFinance/ListOfEmployees";
import ProjectsList from "../Components/IndianFinance/Projects";
import AddExpense from "../Components/IndianFinance/AddExpense";
import NotFound from "../Components/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AllRecnetActivities from "../Components/Admin/Pages/AllRecnetActivities";
import ProfitLossSummary from "../Components/IndianFinance/ProfitLossSummary";
export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <RoleBasedRoutes />
    </ProtectedRoute>
  );
}
function RoleBasedRoutes() {
  const sessionData = localStorage.getItem("sessionData");
  const userDetails = sessionData ? JSON.parse(sessionData) : null;
  let userRole = userDetails?.employee?.role?.name.toLowerCase() || "guest";
  const roleMap = {
    "project manager": "project_manager",
    "us-finance": "usfinance_team",
    "indian-finance": "indianfinance_team",
  };
  userRole = roleMap[userRole] || userRole;
  const roleBasedRoutes = {
    admin: [
      { path: "/AdminDashboard", element: <AdminDashboard /> },
      { path: "/Employees", element: <Employees /> },
      { path: "/AddEmployee", element: <AddEmployee /> },
      { path: "/AddProject", element: <AddProject /> },
      { path: "/All/Projects", element: <Projectss /> },
      { path: "/ViewProject", element: <ViewProject /> },
      { path: "/Roles", element: <Roles /> },
      { path: "/EmployeeDetails", element: <EmployeeDetails /> },
      { path: "/EditEmployee", element: <EditEmployeePopup /> },
      { path: "/AllRecnetActivities", element: <AllRecnetActivities /> },
    ],
    project_manager: [
      { path: "/Employeeslist", element: <Employeess /> },
      { path: "/EmployeeDetails", element: <EmployeeDetails /> },
      { path: "/ProjectManagerProjects", element: <ProjectManagerProjects /> },
      { path: "/ViewProject", element: <ViewProject /> },
      { path: "/TimeSheet", element: <TimeSheetModule /> },
      { path: "/Notifications", element: <Notifications /> },
    ],
    usfinance_team: [
      { path: "/FinanceDashboard", element: <UsFinanceTeamDashboard /> },
      {
        path: "/USFinanceTeamAllProjects",
        element: <USFinanceTeamAllProjects />,
      },
      { path: "/USFinance/AddRevenue", element: <AddRevenue /> },
    ],
    indianfinance_team: [
      { path: "/Dashboard", element: <IndianFinanceTeamDashboard /> },
      { path: "/EmployeeList", element: <ListOfEmployees /> },
      { path: "/EmployeeDetails", element: <EmployeeDetails /> },
      { path: "/ProjectList", element: <ProjectsList /> },
      { path: "/ViewProject", element: <ViewProject /> },
      { path: "/AddExpense", element: <AddExpense /> },
      { path: "/Notifications", element: <Notifications /> },
      { path: "/ProfitSummary", element: <ProfitLossSummary /> },
    ],
  };
  const accessibleRoutes = roleBasedRoutes[userRole] || [];
  return (
    <Sidebar>
      <Routes>
        {accessibleRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Sidebar>
  );
}
