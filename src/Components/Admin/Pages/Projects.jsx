import axios from "axios";
import "../../../assets/Styles/Projects.css";
import { useEffect } from "react";
import "../../../assets/Styles/Employee.css";
import { useState } from "react";
import { isPast } from "date-fns";
import image from "../../../assets/Images/Editicon.png";
import deleteimage from "../../../assets/Images/deleteicon.png";
import userimage from "../../../assets/Images/User.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import elipisimage from "../../../assets/Images/Ellipse.png";
import checkimage from "../../../assets/Images/check.png";
import { CoPresentOutlined } from "@mui/icons-material";
import ProjectService from "../../../Service/AdminService/ProjectService";

export default function Projectss() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [Projects, setProjects] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    FetchData();
  }, [selectedProjectIds]);
  const FetchData = async () => {
    const response = await ProjectService.FcnGetAllProjects();
    const result = response.data;
    setProjects(result.item);
  };

  const AddNewProject = () => {
    navigate("/Dashboard/AddProject");
  };
  const DeleteProject = async (e, index, projectid) => {
    var response = await ProjectService.FcnDeleteProject(projectid);
    var result = response.data;

    if (result.isSuccess) {
      FetchData();
      setOpen(true);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredEmployees = Projects.filter((project) => {
    return (
      project.project.projectName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.project.projectID
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const DeleteMessageClose = async () => {
    setOpen(false);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const ViewProject = (projectid) => {
    sessionStorage.setItem("id", projectid);
    navigate("/dashboard/ViewProject");
  };

  const handleCheckboxChange = (projectid, isChecked) => {
    setSelectedProjectIds((prevSelected) => {
      let updatedSelected;
      if (isChecked) {
        updatedSelected = [...prevSelected, projectid];
      } else {
        updatedSelected = prevSelected.filter((id) => id !== projectid);
      }

      if (updatedSelected.length === 0) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }

      return updatedSelected;
    });
  };

  const DeleteSelectedRecords = async () => {
    const response = await ProjectService.FcnDeleteSelectedProject(
      selectedProjectIds
    );
    const result = response.data;

    if (result.isSuccess) {
      setOpen(true);
      FetchData();
    }
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allProjectIds = currentItems.map((project) => project.project.id);
      setSelectedProjectIds(allProjectIds);
      setDisiblebuttons(false);
    } else {
      setSelectedProjectIds([]);
      setDisiblebuttons(true);
    }
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  return (
    <div className="">
      <p className="project-list-content" style={{ fontSize: "16px" }}>
        Projects
      </p>
      <div className="AllProject-maindiv">
        <div className="container-fluid pt-3">
          <div className="row g-2 row-cols-1 row-cols-md-auto align-items-center justify-content-md-between">
            <div className="col">
              <p
                className="Project-list-content mb-0"
                style={{ fontSize: "14px" }}
              >
                Project list
              </p>
            </div>

            <div className="col position-relative col-6 col-md-6 col-lg-5">
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchQuery}
                className="form-control"
                placeholder="Search Projects"
                style={{ fontSize: "14px", paddingRight: "30px" }}
              />
              <i
                className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2"
                style={{
                  fontSize: "18px",
                  color: "#888",
                  pointerEvents: "none",
                }}
              ></i>
            </div>

            <div className="col">
              <select
                className="form-select"
                onChange={handleItemsPerPageChange}
                value={itemsPerPage}
                style={{ fontSize: "14px", height: "36px" }}
              >
                <option value="10">Show 10 Entities</option>
                <option value="25">Show 25 Entities</option>
                <option value="50">Show 50 Entities</option>
                <option value="-1">Show All</option>
              </select>
            </div>

            <div className="col d-flex justify-content-md-end">
              <button
                className="btn btn-danger w-100 w-md-auto"
                disabled={disiblebuttons}
                onClick={DeleteSelectedRecords}
                style={{ fontSize: "14px", height: "36px" }}
              >
                Delete Selected
              </button>
            </div>

            {/* Add new project button */}
            <div className="col d-flex justify-content-md-start">
              <button
                className="btn btn-light border d-flex align-items-center w-100 w-md-auto"
                onClick={AddNewProject}
                style={{ height: "36px", fontSize: "14px" }}
              >
                <img
                  src={userimage}
                  alt="Add"
                  height="18px"
                  width="18px"
                  className="me-2"
                />
                <strong>Add New Project</strong>
              </button>
            </div>
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
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    style={{ height: "15px", width: "15px" }}
                    className="userCheckbox row-checkbox"
                  />
                </th>
                <th style={{ fontSize: "14px" }}>Project ID</th>
                <th style={{ fontSize: "14px" }}>Project Name</th>
                <th style={{ fontSize: "14px" }}>Clients</th>
                <th style={{ fontSize: "14px" }}>Project Manager</th>
                <th style={{ fontSize: "14px" }}>Start Date</th>
                <th style={{ fontSize: "14px" }}>End Date</th>
                <th style={{ fontSize: "14px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(
                  (project, index) =>
                    project.project.status == 1 && (
                      <tr
                        key={index}
                        className="tablebody"
                        style={{ backgroundColor: "white", cursor: "pointer" }}
                      >
                        <td style={{ textAlign: "start" }}>
                          <input
                            type="checkbox"
                            className="row-checkbox "
                            onChange={(e) =>
                              handleCheckboxChange(
                                project.project.id,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.project.projectID}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.project.projectName}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.client.clientName}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.employee.firstName}{" "}
                          {project.employee.lastName}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.project.startDate}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                          onClick={(e) => ViewProject(project.project.id)}
                        >
                          {project.project.endDate}
                        </td>
                        <td>
                          <img
                            className="ms-3"
                            src={deleteimage}
                            onClick={(e) =>
                              DeleteProject(e, index, project.project.id)
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
                )
              ) : (
                <tr style={{ width: "100%" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>No Records Found</td>
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
                    src={elipisimage}
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
                onClick={DeleteMessageClose}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <div className="pagination" style={{ paddingBottom: "35px" }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            style={{ fontSize: "14px" }}
          >
            <span> Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                style={{ fontSize: "14px", color: "black", fontWeight: "600" }}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "active-page" : ""}
              >
                {page}
              </button>
            )
          )}

          <button
            style={{ fontSize: "14px", color: "black", fontWeight: "600" }}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
