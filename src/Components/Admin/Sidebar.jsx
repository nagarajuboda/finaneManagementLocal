import { useState, useEffect } from "react";
import "../../assets/Styles/Sidebar.css";
import logo from "../../assets/Images/ArchentsLogo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IoPeopleOutline } from "react-icons/io5";
import { VscProject } from "react-icons/vsc";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCalendarDay } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { VscTasklist } from "react-icons/vsc";
import { FaChevronRight } from "react-icons/fa";
import { RiDashboard3Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import "../../assets/Styles/Sidebar.css";
import archetslogo from "../../../src/assets/Images/primary-logo.png";
import dashboardsidebarimage from "../../assets/Images/DBicon.png";
import billing from "../../assets/Images/billing.png";
import Logout from "../../assets/Images/Logout.png";
import report from "../../assets/Images/accountandreport.png";
import ProjectManagement from "../../assets/Images/ProjectManagement.png";
import hrManagement from "../../assets/Images/management.png";
import Header from "./Header";
import sidebarimage from "../../../src/assets/Images/sidemenu.png";
const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const togglePopup = (item) => {
    if (!isOpen) return;
    setSelectedMenu(item);
    setIsPopupOpen(!isPopupOpen);
  };
  const toggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setOpenDropdowns([]);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("sessionData");
    if (data) {
      setSessionData(JSON.parse(data));
    }
  }, [isOpen]);

  const toggleDropdown = (index) => {
    if (!isOpen) return;
    setOpenDropdowns((prevOpenDropdowns) => {
      if (prevOpenDropdowns.includes(index)) {
        return prevOpenDropdowns.filter((i) => i !== index);
      } else {
        return [...prevOpenDropdowns, index];
      }
    });
  };

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: dashboardsidebarimage,
      path: "/dashboard/AdminDashboard",
    },
    {
      name: "HR Management",
      icon: hrManagement,
      submenu: [
        { path: "/dashboard/Employees", name: "Employees" },
        { path: "/Dashboard/Roles", name: "Roles" },
      ],
    },
    {
      name: "Project Management",
      icon: ProjectManagement,
      submenu: [
        { path: "/Dashboard/AddProject", name: "Add Project" },
        { path: "/Dashboard/All/Projects", name: "Projects" },
      ],
    },
    // {
    //   name: "Logout",
    //   icon: Logout,
    //   path: "/user/Login",
    //   action: () => {
    //     localStorage.removeItem("sessionData");
    //   },
    // },
  ];

  const ProjectManagerMenuItems = [
    // {
    //   name: "Dashboard",
    //   icon: dashboardsidebarimage,
    //   path: "/Dashboard/ManagerDasboard",
    // },
    {
      name: "HR Management",
      icon: hrManagement,
      submenu: [{ path: "/dashboard/Employeeslist", name: "Employees" }],
    },
    {
      name: "Project Management",
      icon: ProjectManagement,
      submenu: [
        { path: "/Dashboard/ProjectManagerProjects", name: "Projects" },
      ],
    },
    {
      name: "Billing",
      icon: billing,
      submenu: [{ path: "/Dashboard/TimeSheet", name: "TimeSheet" }],
    },
    {
      name: "Logout",
      icon: Logout,
      path: "/user/Login",
    },
  ];

  const usFinanceTeamMenuItems = [
    {
      name: "Dashboard",
      icon: dashboardsidebarimage,
      path: "/Dashboard/FinanceDashboard",
    },
    {
      name: "Project Management",
      icon: ProjectManagement,
      submenu: [
        { path: "/Dashboard/USFinanceTeamAllProjects", name: "Projects" },
      ],
    },
  ];

  const IndianFinanceTeamMenuItems = [
    {
      name: "Dashboard",
      icon: dashboardsidebarimage,
      path: "/Dashboard/Dashboard",
    },
    {
      name: "Hr Management",
      icon: hrManagement,
      submenu: [{ path: "/dashboard/EmployeeList/", name: "Employees" }],
    },
    {
      name: "Project Management",
      icon: ProjectManagement,
      submenu: [{ path: "/Dashboard/ProjectList", name: "Projects" }],
    },
    {
      name: "Revenue",
      icon: ProjectManagement,
      submenu: [{ path: "/Dashboard/AddExpense", name: "Add Expense" }],
    },
  ];

  const menuItems =
    sessionData?.employee?.role?.name === "Admin"
      ? adminMenuItems
      : sessionData?.employee?.role?.name === "US-finance"
      ? usFinanceTeamMenuItems
      : sessionData?.employee?.role?.name === "Indian-finance"
      ? IndianFinanceTeamMenuItems
      : ProjectManagerMenuItems;

  return (
    <div className="containers" style={{ width: "100vw" }}>
      <div
        style={{
          height: "100vh",
          width: isOpen ? "215px" : "60px",
        }}
        className="sidebar"
      >
        <div className="top_section">
          <div
            style={{
              marginLeft: isOpen ? "215" : "0px",
              display: "flex",

              justifyContent: isOpen ? "flex-start" : "center",
            }}
            className="bars"
          >
            <div style={{ width: "60px", height: "100vh !important" }}>
              <img
                src={sidebarimage}
                alt=""
                onClick={toggle}
                style={{
                  cursor: "pointer",
                  marginTop: "12px",
                  marginLeft: "13px",
                  height: "34px",
                  width: "34px",
                }}
              />
            </div>
            {isOpen && (
              <img
                src={archetslogo}
                alt="Logo"
                className="archentslogo"
                style={{
                  marginLeft: "2px",
                  marginTop: "17px",
                  height: "25px",
                  width: "100px",
                }}
              />
            )}
          </div>
        </div>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item tree"
            style={{ marginTop: "10px" }}
          >
            <ul>
              <NavLink
                to={item.path}
                className="link"
                onClick={() => item.submenu && toggleDropdown(index)}
              >
                <div className="icon">
                  {typeof item.icon === "string" ? (
                    index === 1 ? (
                      <img
                        className="indexicon"
                        style={{ marginLeft: "15px" }}
                        src={item.icon}
                        alt={item.name}
                      />
                    ) : (
                      <img
                        className="iconimages"
                        src={item.icon}
                        alt={item.name}
                      />
                    )
                  ) : (
                    item.icon
                  )}

                  <div
                    style={{
                      display: isOpen ? "" : "none",
                    }}
                    className="link_text"
                  >
                    {index === 0 ? (
                      <div className="menuname1" style={{ fontSize: "14px" }}>
                        {item.name}
                      </div>
                    ) : (
                      <div
                        className="menuname"
                        style={{ fontSize: "14px", marginLeft: "8px" }}
                      >
                        {item.name}
                      </div>
                    )}

                    {item.submenu && index !== 0 && (
                      <FaChevronRight
                        className={`dropdown-icon ${
                          openDropdowns.includes(index) ? "open" : ""
                        }`}
                        style={{ color: "#9f9f9f" }}
                      />
                    )}
                  </div>
                </div>
              </NavLink>
              <ul>
                {item.submenu && (
                  <div
                    className={`submenu ${
                      openDropdowns.includes(index) ? "open" : ""
                    }`}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        to={subItem.path}
                        key={subIndex}
                        className="link submenu_link"
                      >
                        <div
                          style={{ display: isOpen ? "block" : "none" }}
                          className="link_text"
                        >
                          <li>
                            <span>{subItem.name}</span>
                          </li>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </ul>
            </ul>
          </div>
        ))}
      </div>

      <div className="renderdiv" style={{ backgroundColor: "#FAFAFA" }}>
        <div>
          <Header isOpen={isOpen} />
        </div>
        <main
          className="childercomponents"
          style={{ width: isOpen ? "100%" : "100%" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
