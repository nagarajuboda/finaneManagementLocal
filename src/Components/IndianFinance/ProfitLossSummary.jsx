import { useEffect, useState } from "react";
import "../../../src/assets/Styles/ProfitLossSummary.css";
import { useSearchParams } from "react-router-dom";
import IndianFinanceService from "../../Service/IndianFinance/IndianFinanceService";
import USFinanceTeamService from "../../Service/USFinanceTeamService/USFinanceTeamService";
export default function ProfitLossSummary() {
  const [projectWiseProjectOrLossSummary, setprojectWiseProjectOrLossSummary] =
    useState([]);
  const [EmployeeProfitOrSummaryData, setEmployeeProfitOrSummaryData] =
    useState([]);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  useEffect(() => {
    FetchData();
  }, []);
  const FetchData = async () => {
    var Expensesresponse = await USFinanceTeamService.FcnGetRevenueOverView(
      month,
      year
    );
    var result = Expensesresponse.data;
    if (result.isSuccess) {
      setprojectWiseProjectOrLossSummary(result.item);
    }
    var employeeProfitOrLossSummaryDataResponse =
      await IndianFinanceService.FcnEmployeeProfitOrLossSummary(month, year);
    if (employeeProfitOrLossSummaryDataResponse.isSuccess) {
      setEmployeeProfitOrSummaryData(
        employeeProfitOrLossSummaryDataResponse.item
      );
    }
  };
  return (
    <div>
      <div className="employee-contribution-content ">
        Profit or Loss Summary
      </div>
      <div className="Profit-or-loss-summary mt-2">
        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ fontSize: "14px" }}>Project Name</th>
                <th style={{ fontSize: "14px" }}>Total Revenue</th>
                <th style={{ fontSize: "14px" }}>Total Employee Cost</th>
                <th style={{ fontSize: "14px" }}>Profit</th>
                <th style={{ fontSize: "14px" }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {projectWiseProjectOrLossSummary.length > 0 ? (
                projectWiseProjectOrLossSummary.map((project, index) => {
                  const totalExpenses = project.employeeExpenses?.reduce(
                    (sum, emp) => sum + emp.totalExpense,
                    0
                  );

                  return (
                    <tr
                      key={index}
                      className="tablebody"
                      style={{ backgroundColor: "white", cursor: "pointer" }}
                    >
                      <td>{project.projectName}</td>
                      <td>{`$ ${project.totalRevenue}`}</td>
                      <td>{`$ ${totalExpenses}`}</td>
                      <td>{`$ ${project.totalRevenue - totalExpenses}`}</td>
                      <td>{`${
                        ((project.totalRevenue - totalExpenses) /
                          project.totalRevenue) *
                        100
                      }%`}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="employee-contribution-content mt-3">
        Employee Contribution Table
      </div>
      <div className="Profit-or-loss-summary mt-2">
        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th style={{ fontSize: "14px" }}>Employee Name</th>
                <th style={{ fontSize: "14px" }}>Role</th>
                <th style={{ fontSize: "14px" }}>Hours Logged</th>
                <th style={{ fontSize: "14px" }}>Hourly Rate</th>
                <th style={{ fontSize: "14px" }}>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {EmployeeProfitOrSummaryData.length > 0 ? (
                EmployeeProfitOrSummaryData.map((emp, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{ backgroundColor: "white", cursor: "pointer" }}
                  >
                    <td style={{ fontSize: "14px" }}>
                      {emp.employee.firstName} {emp.employee.lastName}
                    </td>
                    <td style={{ fontSize: "14px" }}>{emp.role.name}</td>
                    <td style={{ fontSize: "14px" }}>
                      {emp.timesheet.hoursWorked}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      $
                      {emp.revenue?.hourlyRate
                        ? emp.revenue.hourlyRate.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : "0"}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      ${emp.revenueGenerated.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", fontSize: "14px" }}
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
