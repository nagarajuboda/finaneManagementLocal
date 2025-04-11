import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Styles/Employee.css";
import editicon from "../../assets/Images/Editicon.png";
import "../../assets/Styles/EmployeePages/Roles.css";
import deleteicon from "../../assets/Images/deleteicon.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import images from "../../assets/Images/User.png";
import axios from "axios";
import EditEmployeePopup from "./EditEmployeePopup";
import ImportPopup from "./ImportPopup";
import ellips from "../../assets/Images/Ellipse.png";
import checkimage from "../../assets/Images/check.png";
import EmployeeDetails from "./EmployeeDetails";
import { useTheme } from "@emotion/react";
import Dropdown from "react-bootstrap/Dropdown";
import { apiurl } from "../../Service/createAxiosInstance";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
export default function Employees() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [DeleteEmployeesflog, SetDeletedEmployeeflog] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  useEffect(() => {
    FetchData();
  }, [selectedEmployeeIds, isDivVisible]);

  const EdittogglePopup = (e, index, employeeid) => {
    sessionStorage.setItem("EmployeeID", employeeid);
    navigate("/dashboard/EditEmployee");
  };
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const FetchData = async () => {
    const response = await EmployeeService.GetEmployees();
    var result = response.item;
    setEmployees(result);
  };
  const handleOpenPopup = async (e, index, id) => {
    var response = await EmployeeService.DeleteEmployees(id);
    var result = response;
    debugger;
    if (result.isSuccess === true) {
      FetchData();
      setOpen(true);
    }
  };

  const closeDeletePopup = () => {
    setOpen(false);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allEmployeeIds = currentItems.map((emp) => emp.employeeDetails.id);
      setSelectedEmployeeIds(allEmployeeIds);
      setDisiblebuttons(false);
    } else {
      setSelectedEmployeeIds([]);
      setDisiblebuttons(true);
    }
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  const Addemployeefuncton = () => {
    navigate("/dashboard/AddEmployee");
  };
  const DeleteSelectedRecords = async () => {
    const response = await EmployeeService.DeleteSelectedEmployees(
      selectedEmployeeIds
    );
    const result = response;
    if (result.isSuccess) {
      setOpen(true);
      FetchData();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.employeeDetails.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.employeeDetails.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.employeeDetails.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.employeeDetails.employeeId
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  let activeEmployees = [];

  if (isDivVisible === true) {
    activeEmployees = filteredEmployees.filter(
      (emp) => emp.employeeDetails.employeeStatus === 0
    );
  } else {
    activeEmployees = filteredEmployees.filter(
      (emp) => emp.employeeDetails.employeeStatus === 1
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

  const handleCheckboxChange = (employeeId, isChecked) => {
    setSelectedEmployeeIds((prevSelected) => {
      let updatedSelected;
      if (isChecked) {
        updatedSelected = [...prevSelected, employeeId];
      } else {
        updatedSelected = prevSelected.filter((id) => id !== employeeId);
      }

      if (updatedSelected.length === 0) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }

      return updatedSelected;
    });
  };
  const DownloadExcel = async (listtype, filetype) => {
    let response;

    try {
      if (isDivVisible == false) {
        response = await EmployeeService.fcnExportEmployees(
          listtype,
          filetype,
          "Active"
        );
      } else {
        response = await EmployeeService.fcnExportEmployees(
          listtype,
          filetype,
          "Inactive"
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
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {isDivVisible ? (
            <div
              className="mt-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "150px",
              }}
            >
              <p className="employeecontent" style={{ fontSize: "14px" }}>
                Employee's Deactivated
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="employeecontent" style={{ fontSize: "14px" }}>
                Employee list
              </p>
            </div>
          )}

          {isDivVisible && (
            <div style={{ minWidth: "180px" }}>
              {/* Just a spacer or use for additional content */}
            </div>
          )}

          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              // minWidth: "250px",
              flexGrow: 1,
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
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
                pointerEvents: "none",
              }}
            ></i>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              minWidth: "230px",
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
                  fontSize: "14px",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "200px",
                  maxWidth: "auto",
                }}
                className="Show-Deleted-employee-button"
              >
                Show Deleted Employees
              </button>
            ) : (
              <button
                disabled={deleteEmployeebuttondisible}
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // minWidth: "150px",
                  width: "100%",
                  maxWidth: "auto",
                }}
                className="Show-Deleted-employee-button"
              >
                <span className="deleteSelectedd">Deleted Employees</span>
              </button>
            )}
          </div>

          {!isDivVisible && (
            <div style={{ minWidth: "100px" }}>
              <button
                style={{ fontSize: "14px", height: "36px", width: "100%" }}
                className="btn btn-primary"
                onClick={() => setIsPopupOpen(true)}
              >
                Import
              </button>
            </div>
          )}

          <div>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="importdropdown btn btn-primary"
                style={{ fontSize: "14px", height: "36px", width: "100%" }}
              >
                Export To
              </Dropdown.Toggle>
              <Dropdown.Menu className="responsivedropdownmenu">
                <Dropdown.Item
                  style={{ fontSize: "14px" }}
                  onClick={() => DownloadExcel("employees", "excel")}
                >
                  MS Excel
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ fontSize: "14px" }}
                  onClick={() => DownloadExcel("employees", "pdf")}
                >
                  Adobe PDF
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {!isDivVisible && (
            <div>
              <button
                className="btn btn-danger deleteSelected"
                disabled={disiblebuttons}
                onClick={DeleteSelectedRecords}
                style={{
                  fontSize: "14px",
                  height: "36px",
                  width: "100%",
                  cursor: disiblebuttons ? "not-allowed" : "pointer",
                  opacity: disiblebuttons ? 0.65 : 1,
                  pointerEvents: disiblebuttons ? "auto" : "all",
                }}
              >
                Delete Selected
              </button>
            </div>
          )}

          {!isDivVisible && (
            <div className="">
              <button
                className="add-new-project-button"
                onClick={Addemployeefuncton}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  height: "36px",
                  width: "100%",
                }}
              >
                <img
                  src={images}
                  alt=""
                  height="18px"
                  width="18px"
                  style={{ marginBottom: "2px" }}
                />
                <span
                  className="ms-1"
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Add Employee
                </span>
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "10px", overflowX: "auto" }}>
          <table
            id="example"
            className="employeeTable"
            style={{ width: "100%", minWidth: "1000px" }}
          >
            <thead>
              <tr className="tableheader ">
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="userCheckbox row-checkbox"
                  />
                </th>
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
                {!isDivVisible && <th></th>}
                {!isDivVisible && <th></th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((employee, index) =>
                  !isDivVisible
                    ? employee.employeeDetails.employeeStatus === 1 && (
                        <tr
                          key={employee.employeeDetails.id}
                          className="tablebody EmployeeListtablelistrow"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}>
                            <input
                              type="checkbox"
                              className="row-checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  employee.employeeDetails.id,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            <span className="ms-2">
                              {" "}
                              {employee.employeeDetails.employeeId}
                            </span>
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.firstName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.lastName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.email}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.mobileNo}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {new Date(
                              employee.employeeDetails.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            Active
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.roleDetails.roleName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.reportingManagerDetails !== "N/A"
                              ? `${employee.reportingManagerDetails.firstName} ${employee.reportingManagerDetails.lastName}`
                              : "N/A"}
                          </td>
                          <td>
                            <img
                              src={editicon}
                              onClick={(e) =>
                                EdittogglePopup(
                                  e,
                                  index,
                                  employee.employeeDetails.id
                                )
                              }
                              alt=""
                              style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                              }}
                            />
                          </td>
                          <td>
                            <img
                              src={deleteicon}
                              onClick={(e) =>
                                handleOpenPopup(
                                  e,
                                  index,
                                  employee.employeeDetails.id
                                )
                              }
                              alt=""
                              style={{
                                width: "28px",
                                height: "28px",
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                      )
                    : employee.employeeDetails.employeeStatus === 0 && (
                        <tr
                          key={employee.employeeDetails.id}
                          className="tablebody"
                          style={{
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <td style={{ textAlign: "start" }}>
                            <input
                              type="checkbox"
                              className="row-checkbox "
                              onChange={(e) =>
                                handleCheckboxChange(
                                  employee.employeeDetails.id,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td
                            style={{ fontSize: "14px ms-2" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.employeeId}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.firstName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.lastName}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.email}
                          </td>
                          <td
                            style={{ fontSize: "14px" }}
                            onClick={(e) =>
                              ViewDetails(employee.employeeDetails.id)
                            }
                          >
                            {employee.employeeDetails.mobileNo}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {new Date(
                              employee.employeeDetails.dateOfJoining
                            ).toLocaleDateString("en-GB")}
                          </td>

                          <td style={{ fontSize: "14px" }}>
                            {employee.roleDetails.roleName}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {employee.reportingManagerDetails !== "N/A"
                              ? `${employee.reportingManagerDetails.firstName} ${employee.reportingManagerDetails.lastName}`
                              : "N/A"}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {employee.employeeDetails.dateOfReliving}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "35px",
          }}
        >
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
