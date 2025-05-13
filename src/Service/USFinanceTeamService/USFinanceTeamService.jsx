import axios from "axios";
import { apiurl } from "../createAxiosInstance";
const USFinanceTeamService = {
  async FcnGetProjectDetails(id) {
    const response = await apiurl.get(`/Projects/GetProject?id=${id}`);
    return response;
  },
  async FcnGetRevenue(Projectid, month, year) {
    const response = await apiurl.get(
      `/Revenue/GetSubmittedRevenuesByProjectIdAndDate?projectId=${Projectid}&month=${month}&year=${year}`
    );
    return response.data;
  },
  async GetbillableAndNonbillablePercentage() {
    const response = await apiurl.get(
      "/Revenue/GetBillableEmployeesPercentage"
    );
    return response.data;
  },
  async AddRevenue(obj, isSubmitted) {
    const response = await apiurl.post(
      `/Revenue/AddRevenue?isSubmitted=${isSubmitted}`,
      obj
    );
    return response.data;
  },
  async FcnGetRevenueOverView(month, year) {
    const response = await apiurl.get(
      `/Revenue/GetRevenueOverview?month=${month}&year=${year}`
    );
    return response;
  },
  async FcnGetTimeSheetDetails(projectID, monthNumber, year) {
    const response = await apiurl.get(
      `/Timesheets/GetTimesheetsByMonthAndYear?projectId=${projectID}&month=${monthNumber}&year=${year}`
    );
    return response;
  },
};
export default USFinanceTeamService;
