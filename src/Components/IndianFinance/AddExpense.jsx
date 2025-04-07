import "../../../src/assets/Styles/AddExpense.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import calenderImage from "../../assets/Images/calendar_11919171.png";
import IndianFinanceService from "../../Service/IndianFinance/IndianFinanceService";
import { select } from "@material-tailwind/react";
import ellips from "../../../src/assets/Images/Ellipse.png";
import checkimage from "../../../src/assets/Images/check.png";
import { FaDollarSign } from "react-icons/fa6";

import axios from "axios";
import { useEffect } from "react";
import { Flag } from "@mui/icons-material";
export default function AddExpense() {
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const [RevenueData, setRevenueData] = useState([]);
  const [generalApportionment, setgeneralApportionment] = useState(0);
  const [GetExpenses, setGetExpenses] = useState([]);
  const [hours, setHours] = useState({});
  const [generalExpensesForEachEmployee, setGeneralExpensesForEachEmployee] =
    useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isSubmittedFlag, SetisSubmittedFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rate, setRate] = useState({});
  const [
    generalApprotionmentSubmittedvalue,
    SetgeneralApprotionmentSubmittedvalue,
  ] = useState();
  const [SpecificApprotionmentvalue, setSpecificApprotionmentvalue] = useState(
    {}
  );
  const [
    generalApportionmentEachEmployee,
    setgeneralApportionmentEachEmployee,
  ] = useState();
  const monthMap = {
    January: "1",
    February: "2",
    March: "3",
    April: "4",
    May: "5",
    June: "6",
    July: "7",
    August: "8",
    September: "9",
    October: "10",
    November: "11",
    December: "12",
  };
  useEffect(() => {
    handleDateChange(selectedDate);
  }, [generalApprotionmentSubmittedvalue]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    var getMonthNunber = monthMap[month];
    var Expensesresponse = await IndianFinanceService.GetExpenses(
      getMonthNunber,
      year
    );
    setGetExpenses(Expensesresponse.item);
    if (Expensesresponse.item.length > 0) {
      var GeneralApprotionmentvalue = await Expensesresponse.item.map(
        (data) => data.generalApportionment
      );
      var getisSubmitted = await Expensesresponse.item.map(
        (data) => data.isSubmitted
      );
      SetisSubmittedFlag(getisSubmitted[0]);
      setgeneralApportionmentEachEmployee(GeneralApprotionmentvalue[0]);
      const totalSum = GeneralApprotionmentvalue.reduce(
        (acc, curr) => acc + curr,
        0
      );
      setgeneralApportionment(totalSum);
    } else {
      SetisSubmittedFlag(false);
      setgeneralApportionment("");
      setgeneralApportionmentEachEmployee(0);
    }
    var response = await IndianFinanceService.GetRevenue(getMonthNunber, year);
    if (response.isSuccess) {
      setRevenueData(response.item);
      if (response.item.length === 0) {
        SetisSubmittedFlag(true);
      }
    }

    const newHours = {};
    Expensesresponse.item.forEach((each) => {
      newHours[each.employeeId] = each.specificApportionment;
    });
    setHours(newHours);
  };
  const handleChange = (e) => {
    const amount = Number(e.target.value) || "";
    if (!amount) {
      setError("This field is required");
    } else {
      setError("");
    }
    setgeneralApportionment(amount);
    const employeeCount = RevenueData.length;
    const amountPerEmployee = employeeCount > 0 ? amount / employeeCount : 0;
    setgeneralApportionmentEachEmployee(amountPerEmployee);
  };

  const AddExpenses = async (isSubmitted) => {
    if (!generalApportionment) {
      setError("This field is required");
    } else {
      const month = selectedDate.toLocaleString("default", { month: "long" });
      const year = selectedDate.getFullYear();
      var getMonthNunber = monthMap[month];
      const employeeData = RevenueData.map((employee) => ({
        employeeId: employee.id,
        specificApportionment: hours[employee.id] || 0,
        generalApportionment: generalApportionmentEachEmployee,
        month: Number(getMonthNunber),
        year: year,
        revenueGenerated: Number(employee.revenueAmount),
      }));
      var response = await IndianFinanceService.AddExpenses(
        employeeData,
        isSubmitted
      );
      if (response.isSuccess) {
        if (isSubmitted === "false") {
          setIsOpen(true);
          handleDateChange(selectedDate);
        } else {
          setIsOpen1(true);
          handleDateChange(selectedDate);
        }
      }
    }
  };
  const handleHoursChange = (EmployeeID, value) => {
    setHours((prev) => ({
      ...prev,
      [EmployeeID]: value,
    }));
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredEmployees = RevenueData.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  return (
    <div>
      <span className="Expenses-span">Expense</span>
      <div className="Add-Expense-MainDiv">
        <div
          className="General-Apportionment "
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "25px 10px 0px 10px",
          }}
        >
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <span className="">General Apportionment</span>
              <span className="ms-1" style={{ color: "red" }}>
                *
              </span>
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              className="ms-2"
            >
              <FaDollarSign
                className="ms-1"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "2px",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  pointerEvents: "none",
                  color: "#555",
                }}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="number"
                  className="timesheet_input form-control ps-4"
                  value={generalApportionment}
                  onChange={handleChange}
                  disabled={isSubmittedFlag}
                />
                <span style={{ color: "red" }} className="ms-2">
                  {error}
                </span>
              </div>
            </div>
          </div>
          <div className="me-4" style={{ display: "flex" }}>
            <div
              className="me-4"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <input
                type="text"
                className="searchinput"
                placeholder="Search employees"
                onChange={handleSearchChange}
                value={searchQuery}
                style={{
                  fontSize: "14px",
                  padding: "0px 8px",
                  width: "300px",
                  height: "36px",
                  paddingRight: "30px",
                  boxSizing: "border-box",
                }}
              />
              <i
                className="bi bi-search"
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              maxDate={
                new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              }
              className="timesheet-datepicker"
              customInput={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    <img
                      src={calenderImage}
                      alt=""
                      height="20px"
                      width="20px"
                    />
                  </span>
                  <span>
                    {selectedDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              }
            />
          </div>
        </div>
        <div style={{ padding: "10px" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="tableheader">
                <th>Employee ID</th>
                <th style={{ fontSize: "14px" }}>Employee Name</th>
                <th style={{ fontSize: "14px" }}>Revenue Generated</th>
                <th style={{ fontSize: "14px" }}>Specific Apportionment</th>
                <th style={{ fontSize: "14px" }}>General Apportionment</th>
                <th style={{ fontSize: "14px" }}>Total Expenses</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((Revenue, index) => (
                  <tr
                    key={index}
                    className="tablebody"
                    style={{
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ fontSize: "14px" }}>{Revenue.employeeId}</td>
                    <td style={{ fontSize: "14px" }}>
                      {Revenue.firstName} {Revenue.lastName}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      <span>
                        <FaDollarSign
                          className=" ms-1 mb-1 "
                          style={{ fontSize: "14px" }}
                        />
                      </span>
                      <span className="ms-1">
                        {Revenue.revenueAmount ? Revenue.revenueAmount : "0"}
                      </span>
                    </td>
                    <td>
                      {GetExpenses.length > 0 ? (
                        GetExpenses.filter(
                          (obj) => obj.employeeId === Revenue.id
                        ).map((filteredEmployee) => (
                          <div key={filteredEmployee.employeeId}>
                            {filteredEmployee.isSubmitted === true ? (
                              <div style={{ display: "flex" }}>
                                <FaDollarSign
                                  className=" ms-1 mt-1"
                                  style={{ fontSize: "14px" }}
                                />
                                <span
                                  className="ms-1"
                                  style={{
                                    textAlign: "start",
                                    display: "flex",
                                    justifyContent: "start",
                                    fontSize: "14px",
                                  }}
                                >
                                  {filteredEmployee.specificApportionment}
                                </span>
                              </div>
                            ) : (
                              <div
                                key={filteredEmployee.employeeId}
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  fontSize: "14px",
                                }}
                              >
                                <input
                                  type="number"
                                  className="timesheet_input form-control  "
                                  value={hours[Revenue.id] || ""}
                                  onChange={(e) =>
                                    handleHoursChange(
                                      Revenue.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div
                          style={{ display: "flex", justifyContent: "start" }}
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <FaDollarSign
                              className=" ms-1"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "2px",
                                transform: "translateY(-50%)",
                                fontSize: "14px",
                                pointerEvents: "none",
                                color: "#555",
                              }}
                            />
                            <input
                              type="number"
                              className="timesheet_input form-control ps-4"
                              d
                              value={hours[Revenue.id] || ""}
                              onChange={(e) =>
                                handleHoursChange(Revenue.id, e.target.value)
                              }
                              style={{ paddingLeft: "30px" }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <FaDollarSign
                          className="ms-1"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "18px",
                            transform: "translateY(-50%)",
                            fontSize: "14px",
                            pointerEvents: "none",
                            color: "#555",
                          }}
                        />
                        <input
                          type="number"
                          className="timesheet_input form-control ms-3 ps-4 "
                          placeholder="$"
                          value={generalApportionmentEachEmployee ?? 0}
                          disabled
                          style={{ paddingLeft: "30px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <FaDollarSign
                          className="ms-1"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "2px",
                            transform: "translateY(-50%)",
                            fontSize: "14px",
                            pointerEvents: "none",
                            color: "#555",
                          }}
                        />
                        <input
                          type="number"
                          className="timesheet_input form-control ps-4 "
                          value={
                            (Number(generalApportionmentEachEmployee) || 0) +
                            (Number(SpecificApprotionmentvalue[Revenue.id]) ||
                              0) +
                            (Number(hours[Revenue.id]) || 0)
                          }
                          disabled={true}
                          style={{
                            textAlign: "center",
                            fontSize: "14px",
                            paddingLeft: "30px",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>

                  <td></td>
                  <td style={{ fontSize: "14px" }}>No Records Found</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div></div>
            {RevenueData.length > 0 && (
              <div>
                <button
                  type="button"
                  className="AddRevneueSaveButton me-3 ExpensesSaveButton"
                  disabled={isSubmittedFlag}
                  onClick={() => AddExpenses("false")}
                >
                  <span
                    className="AddRevneueSaveButtonSpan "
                    style={{ fontSize: "14px" }}
                  >
                    Save
                  </span>
                </button>
                <button
                  type="button"
                  className="AddRevneueSubmitButton ExpensesSubmitButton"
                  onClick={() => AddExpenses("true")}
                  disabled={isSubmittedFlag}
                >
                  <span className="AddRevneueSubmitButtonSpan"> Submit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={checkimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={ellips}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              Monthly Expenses Saved Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIsOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isOpen1 && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-container">
            <div className="unique-popup-icon">
              <div className="ellipse-container">
                <img
                  src={checkimage}
                  alt="Check"
                  className="check-image"
                  height="40px"
                  width="40px"
                />
                <img
                  src={ellips}
                  alt="Ellipse"
                  className="ellipse-image"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
            <h2 className="unique-popup-title">
              Monthly Expenses Submitted Successfully!
            </h2>
            <p className="unique-popup-message">Click OK to see the result</p>
            <button
              className="unique-popup-button"
              onClick={() => setIsOpen1(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
