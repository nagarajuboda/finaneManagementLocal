import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Styles/Employee.css";
import editicon from "../../assets/Images/Editicon.png";
import deleteicon from "../../assets/Images/deleteicon.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import images from "../../assets/Images/User.png";
import axios from "axios";
import EditEmployeePopup from "../Employee/EditEmployeePopup";
import ellips from "../../assets/Images/Ellipse.png";
import checkimage from "../../assets/Images/check.png";
import EmployeeDetails from "../Employee/EmployeeDetails";
import ImportPopup from "../Employee/ImportPopup";
import Dropdown from "react-bootstrap/Dropdown";
import { getSessionData } from "../../Service/SharedSessionData";
import { apiurl } from "../../Service/createAxiosInstance";
import ManagerService from "../../Service/ManagerService/ManagerService";
export default function Employees() {
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  var id = userDetails.employee.id;
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [DeleteEmployeesflog, SetDeletedEmployeeflog] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionData, setSessionDataState] = useState(null);
  useEffect(() => {
    FetchData();
  }, [selectedEmployeeIds, isDivVisible, id]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const FetchData = async () => {
    const response = await ManagerService.FcnGetEmployeesByManager(id);
    var result = response.data.item;
    setEmployees(result);
  };

  const closeDeletePopup = () => {
    setOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  let activeEmployees = [];

  if (isDivVisible === true) {
    activeEmployees = filteredEmployees.filter(
      (emp) => emp.employeeStatus === 0
    );
  } else {
    activeEmployees = filteredEmployees.filter(
      (emp) => emp.employeeStatus === 1
    );
  }
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(activeEmployees.length / itemsPerPage);
  const currentItems = activeEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 1);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const DownloadExcel = async (listtype, filetype) => {
    let response;
    try {
      if (isDivVisible == false) {
        response = await ManagerService.FcnExportByManagerEmployees(
          listtype,
          filetype,
          "Active",
          id
        );
      } else {
        response = await ManagerService.FcnExportByManagerEmployees(
          listtype,
          filetype,
          "Inactive",
          id
        );
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      const fileName = `${listtype}_data.${
        filetype === "pdf" ? "pdf" : "xlsx"
      }`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const ViewDetails = (employeeid) => {
    sessionStorage.setItem("id", employeeid);
    navigate("/dashboard/EmployeeDetails");
  };
  const [deleteEmployeebuttondisible, setDeleteEmployeebuttonDisibled] =
    useState(true);

  const handleCheckboxChange1 = (e) => {
    setIsDivVisible(e.target.checked);
    setDeleteEmployeebuttonDisibled(false);
  };
  return (
    <div className="Employeemaindiv">
      <div className="employeeheader">Employees</div>
      <div className="Employeelist">
        <div className="row" style={{ paddingTop: "15px" }}>
          {isDivVisible ? (
            <div
              className="col-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className="employeecontent" style={{ fontSize: "14px" }}>
                Employee's Deactivated
              </p>
            </div>
          ) : (
            <div className="col-5">
              <p className="employeecontent ms-3" style={{ fontSize: "14px" }}>
                Employee list
              </p>
            </div>
          )}
          {isDivVisible && <div className="col-3"></div>}
          <div
            className="col-3"
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
                width: "100%",
                paddingRight: "36px",
                boxSizing: "border-box",
              }}
            />
            <i
              className="bi bi-search"
              style={{
                fontSize: "18px",
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
                pointerEvents: "none",
              }}
            ></i>
          </div>
          <div
            className="col-2"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              onChange={handleCheckboxChange1}
              className="DeleteCheckbox"
              style={{ height: "16px", width: "16px" }}
            />
            {!isDivVisible ? (
              <button
                disabled
                style={{
                  fontSize: "13px",
                  color: "black",
                }}
                className="Show-Deleted-employee-button ms-1"
              >
                Show Deleted Employees
              </button>
            ) : (
              <button
                disabled={deleteEmployeebuttondisible}
                style={{
                  fontSize: "14px",
                }}
                className="Show-Deleted-employee-button ms-1"
              >
                <span className="deleteSelectedd" style={{ fontSize: "14px" }}>
                  Deleted Employees
                </span>
              </button>
            )}
          </div>
          <div className="col-1 " style={{ padding: "0px" }}>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="importdropdown btn btn-primary"
                style={{ fontSize: "14px", height: "36px" }}
              >
                Export To
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ paddingTop: "10px" }}>
                <Dropdown.Item
                  onClick={() => DownloadExcel("employees", "excel")}
                >
                  <p
                    className=""
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    MS Excel
                  </p>
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ marginTop: "5px" }}
                  onClick={() => DownloadExcel("employees", "pdf")}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
                <th></th>
                <th style={{ fontSize: "14px" }}>Employee ID</th>
                <th style={{ fontSize: "14px" }}>First Name</th>
                <th style={{ fontSize: "14px" }}>Last Name</th>
                <th style={{ fontSize: "14px" }}>Email</th>
                <th style={{ fontSize: "14px" }}>Mobile Number</th>
                <th style={{ fontSize: "14px" }}>Date of Joining</th>
                {!isDivVisible && <th style={{ fontSize: "14px" }}>Status</th>}

                <th style={{ fontSize: "14px" }}>Role</th>
                <th style={{ fontSize: "14px" }}>Reporting Manager</th>
                {isDivVisible && (
                  <th style={{ fontSize: "14px" }}>Date of Relieving</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((employee, index) =>
                  !isDivVisible
                    ? employee.employeeStatus === 1 && (
                        <tr
                          key={employee.id}
                          className="tablebody"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}></td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.employeeId}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee?.firstName || "N/A"}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee?.lastName || "N/A"}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.email}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.mobileNo}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            Active
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.role.name}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee?.projectManager &&
                            employee.projectManager !== "N/A"
                              ? `${
                                  employee.projectManager?.firstName || "N/A"
                                } ${employee.projectManager?.lastName || ""}`
                              : "N/A"}
                          </td>
                        </tr>
                      )
                    : employee.employeeStatus === 0 && (
                        <tr
                          key={employee.id}
                          className="tablebody"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}></td>
                          <td
                            style={{ fontSize: "14px ms-2" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.employeeId}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.firstName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.lastName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.email}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) => ViewDetails(employee.id)}
                          >
                            {employee.mobileNo}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {employee.role.name}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {employee.projectManager !== "N/A"
                              ? `${employee.projectManager.firstName} ${employee.projectManager.lastName}`
                              : "N/A"}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {new Date(
                              employee.dateOfReliving
                            ).toLocaleDateString("en-GB")}
                          </td>
                        </tr>
                      )
                )
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>No Records Found</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {open && (
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
              <h2 className="unique-popup-title">Deleted Successfully</h2>
              <p className="unique-popup-message">
                Click OK to see the results
              </p>
              <button
                className="unique-popup-button"
                onClick={closeDeletePopup}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <select
            style={{ cursor: "pointer", fontSize: "14px" }}
            className="numberpagenation ms-2"
            onChange={handleItemsPerPageChange}
            value={itemsPerPage}
          >
            <option value="10" style={{ fontSize: "14px" }}>
              Show 10 Entities
            </option>
            <option value="25" style={{ fontSize: "14px" }}>
              Show 25 Entities
            </option>
            <option value="50" style={{ fontSize: "14px" }}>
              Show 50 Entities
            </option>
            <option value="-1" style={{ fontSize: "14px" }}>
              Show All
            </option>
          </select>
          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={{ fontSize: "14px" }}
            >
              Prev
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                style={{
                  fontSize: "14px",
                  color: "black",
                  fontWeight: "600",
                }}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "active-page" : ""}
              >
                {page}
              </button>
            ))}

            <button
              style={{ fontSize: "14px", color: "black", fontWeight: "600" }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <ImportPopup isOpen={isPopupOpen} handleClose={togglePopup} />
      </div>
    </div>
  );
}
