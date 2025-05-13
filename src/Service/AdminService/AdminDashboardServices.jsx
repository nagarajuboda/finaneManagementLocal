import axios from "axios";
import { apiurl } from "../createAxiosInstance";

const AdminDashboardServices = {
  async fcnAddClientAsync(obj) {
    const response = await apiurl.post("/Clients/Add", obj);

    return response.data;
  },
  async FcnGetAllClients() {
    var response = await apiurl.get("/Clients/GetAllClients");
    return response.data;
    s;
  },
  async fcnAddProject(obj) {
    var response = await apiurl.post("/Projects/NewProject", obj);
    return response.data;
  },
  async fcnUpdateProject(project) {
    var response = await apiurl.post("/Projects/UpdateProject", project);
    return response.data;
  },
  async fcngetEmployees() {
    var response = await apiurl.get("/Projects/GetEmployees");
    return response.data;
  },
  async fcngetEmployee(employeeID) {
    var response = await apiurl.get(`/Employees/GetEmployee?id=${employeeID}`);
    return response.data;
  },
  async fcngetEmployeeDetails(employeeID) {
    var response = await apiurl.get(
      `/Employees/GetEmployeeDetailsById?id=${employeeID}`
    );
    return response.data;
  },
  async fcnAssignEmployee(obj) {
    const response = await apiurl.post("/Projects/AssignEmployee", obj);

    return response.data;
  },
  async DeleteEmployeefcn(id, projectid) {
    const response = await apiurl.delete(
      `/Projects/DeleteProjectEmployee?id=${id}&projectID=${projectid}`
    );

    return response.data;
  },
  async GetAllCurrency() {
    const response = await apiurl.get("/Projects/GetCurrency");

    return response.data;
  },
  async GetAllDepartments() {
    const response = await apiurl.get("/Projects/Departments");

    return response.data;
  },
  async GetDepartmentTeams(deptId) {
    const response = await apiurl.get(`/Projects/DepartmentTeams`, {
      params: {
        deptid: deptId,
      },
    });

    return response.data;
  },
  async GetProjectManager() {
    const response = await apiurl.get(`/Projects/GetProjectManagers`);
    return response.data;
  },
  async getProjectProgressStatus() {
    const response = await apiurl.get(
      "/Projects/projects-progress-status-percentage"
    );
    return response.data;
  },
  async FcnGetRole(roleId) {
    const response = await apiurl.get(`/Roles/getRole?id=${roleId} `);
    return response;
  },
  async FcnActivityLogs() {
    const response = await apiurl.get("/ActivityLog");
    return response.data;
  },
};
export default AdminDashboardServices;
