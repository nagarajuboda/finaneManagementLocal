import axios from "axios";
import "../../assets/Styles/EmployeePages/AdminDashboard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar as ChartJSBar } from "react-chartjs-2";
import { useRef } from "react";
import Chart from "chart.js/auto";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar as RechartsBar,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import DatePicker from "react-datepicker";
import AddEmployeeQuickAction from "../../../src/assets/Images/QuickActions1.png";
import AddProjectQuickAction from "../../../src/assets/Images/QuickActions2.png";
import ProjectUpdateImage from "../../../src/assets/Images/ProjectupdateImage.png";
import Manageroles from "../../../src/assets/Images/QuickActions3.png";
import "react-datepicker/dist/react-datepicker.css";
import UpdateProjectImahe from "../../../src/assets/Images/ProjectUpdateBackUp.png";
import RecentEmployeeImage from "../../../src/assets/Images/AddEmployeeimage.png";
import TeamMemberAddedImage from "../../../src/assets/Images/TeamMemberAdded.png";
import rupee from "../../../src/assets/Images/Rupee.png";
import abcprojectimage from "../../../src/assets/Images/AbcProjectImage.png";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import calenderImage1 from "../../assets/Images/calendar_11919171.png";
import teamMemberAdded from "../../assets/Images/TeamMemberAdded.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(ArcElement, Tooltip, Legend);
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../../Service/EmployeeService/EmployeeService";
import USFinanceTeamService from "../../Service/USFinanceTeamService/USFinanceTeamService";
import AdminDashboardServices from "../../Service/AdminService/AdminDashboardServices";
import IndianFinanceService from "../../Service/IndianFinance/IndianFinanceService";
export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [TotalEmployees, setTotalEmployees] = useState(0);
  const [TotalbenchEmployees, setTotalBenchEmployees] = useState(0);
  const [BillaBleEmployees, setBillbleEmployees] = useState(0);
  const [TotalProject, setTotalProjects] = useState(0);
  const totalEmployees = TotalEmployees;
  const billable = BillaBleEmployees;
  const nonBillable = TotalbenchEmployees;
  const total = billable + nonBillable;
  const barchartintance = useRef(null);
  const billablePercentage = (billable / totalEmployees) * 100;
  const nonBillablePercentage = (nonBillable / totalEmployees) * 100;
  const totalBench = TotalbenchEmployees;
  const internal = 0;
  const noProjects = TotalProject;
  const internalPercentage = totalBench ? (internal / totalBench) * 100 : 0;
  const noProjectsPercentage = totalBench ? (noProjects / totalBench) * 100 : 0;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [InProgress, setInprogress] = useState(0);
  const [NotStatedProgress, SetNotStatedProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const barchartref = useRef(null);
  const [ProfitOrLossSummary, setProfitOrLossSummary] = useState([]);
  const [projectProgress, setProjectProgress] = useState({});
  const navigate = useNavigate();
  const [selectedDate1, setSelectedDate1] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const [Selectedyear, setSelectedYear] = useState("");
  useEffect(() => {
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const year = selectedDate.getFullYear();
    setSelectedYear(year);
    const userDetails = JSON.parse(localStorage.getItem("sessionData"));
    FetchData();
    ProfitOrLossSummaryOnchange(selectedDate);
    Graph(monthlyRevenueData);
  }, [selectedDate]);
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
  const [hasGraphData, setHasData] = useState(false);
  const Graph = (result) => {
    if (barchartintance.current) {
      barchartintance.current.destroy();
    }

    const myChartRef = barchartref.current?.getContext("2d");
    if (!myChartRef) return;

    let Projects = [];
    let revenueValues = [];
    let dataValues = [];
    let highestValue = 0;
    let barcolors = [];

    if (result.isSuccess && result.item.length > 0) {
      Projects = result.item.map((data) => data.projectName);
      revenueValues = result.item.map((data) => data.totalRevenue);
      const hasData = revenueValues.some((val) => val > 0);
      setHasData(hasData);
      if (!hasData) {
        const canvas = barchartref.current;
        const ctx = canvas.getContext("2d");

        // Just clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set hasGraphData to false to show HTML fallback
        setHasData(false);

        return;
      }

      dataValues = revenueValues;
      highestValue = Math.max(...dataValues);
      barcolors = dataValues.map((value) =>
        value === highestValue ? "#335CFF" : "#DCE6EF"
      );
      setHasData(true);

      //   if (!hasData) {
      //     const canvas = barchartref.current;
      //     const ctx = canvas.getContext("2d");
      //     ctx.clearRect(0, 0, canvas.width, canvas.height);
      //     ctx.font = "2px Arial";
      //     ctx.fillStyle = "#666";
      //     ctx.textAlign = "center";
      //     ctx.textBaseline = "middle";

      //     ctx.fillText(
      //       "No revenue data available for this period.",
      //       canvas.width / 2,
      //       canvas.height / 2
      //     );
      //     return;
      //   }
      //   dataValues = revenueValues;
      //   highestValue = Math.max(...dataValues);
      //   barcolors = dataValues.map((value) =>
      //     value === highestValue ? "#335CFF" : "#DCE6EF"
      //   );
      // } else {
      //   const canvas = barchartref.current;
      //   const ctx = canvas.getContext("2d");
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   ctx.font = "10px 'Segoe UI', sans-serif";
      //   ctx.fillStyle = "blac";
      //   ctx.textAlign = "center";
      //   ctx;
      //   ctx.textBaseline = "middle";
      //   ctx.fillText(
      //     "No revenue data available for this period.",
      //     canvas.width / 2,
      //     canvas.height / 2
      //   );
      //   return;
    }

    barchartintance.current = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: Projects,
        datasets: [
          {
            data: revenueValues,
            backgroundColor: barcolors,
            barThickness: 60,
            maxBarThickness: 40,
            categoryPercentage: 10,
            barPercentage: 20,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 700000,
            grid: {
              display: true,
              drawBorder: true,
              color: "#A5AEB4",
              borderDash: [4, 4],
              drawTicks: true,
            },
            border: {
              display: true,
            },
            ticks: {
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#A5AEB4",
              callback: function (value) {
                return `$ ${value.toLocaleString()}`;
              },
            },
          },
          x: {
            grid: {
              display: true,
              drawBorder: true,
              color: "#A5AEB4",
              borderDash: [4, 4],
              drawTicks: true,
            },
            border: {
              display: true,
            },
            ticks: {
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#A5AEB4",
            },
          },
        },
        plugins: {
          chartArea: {
            backgroundColor: "red",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `$${tooltipItem.raw.toLocaleString()}`;
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "customBackgroundColor",
          beforeDraw: (chart) => {
            const { ctx, chartArea } = chart;
            ctx.save();
            ctx.fillStyle = "#F5F5F5";
            ctx.clearRect(0, 0, chart.width, chart.height);
            ctx.fillRect(
              chartArea.left,
              chartArea.top,
              chartArea.right - chartArea.left,
              chartArea.bottom - chartArea.top
            );
            ctx.restore();
          },
        },
      ],
    });

    return () => {
      if (barchartintance.current) {
        barchartintance.current.destroy();
      }
    };
  };

  const ViewAll = () => {
    navigate("/dashboard/AllRecnetActivities");
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const FetchData = async () => {
    var projectProgressResponse =
      await AdminDashboardServices.getProjectProgressStatus();
    setProjectProgress(projectProgressResponse);
    var ActivityLogsResponse = await AdminDashboardServices.FcnActivityLogs();
    setRecentActivities(ActivityLogsResponse);
    var response = await EmployeeService.TotalEmployees();
    var InActiveProjectProgressResponse =
      await EmployeeService.ProjectProgressPercentage();
    SetNotStatedProgress(
      InActiveProjectProgressResponse.item.percentage.notStarted
    );
    setInprogress(InActiveProjectProgressResponse.item.percentage.inProgress);
    setCompleted(InActiveProjectProgressResponse.item.percentage.completed);
    if (response.isSuccess) {
      setTotalEmployees(response.item.item1);
      setTotalBenchEmployees(response.item.item2);
      setBillbleEmployees(response.item.item3);
      setTotalProjects(response.item.item4);
    }
  };
  const sortedRecentActivities = recentActivities
    .filter((notif) => {
      const notifDate = new Date(notif.timestamp);
      const today = new Date();

      return notifDate >= notifDate <= today;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getRelativeTime = (timestamp) => {
    const parsedDate = Date.parse(timestamp);
    if (isNaN(parsedDate)) {
      return "Invalid date";
    }

    const date = new Date(parsedDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) {
      return "Just now";
    }
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };
  const data = {
    labels: ["In Progress", "Completed", "Not Started"],
    datasets: [
      {
        data: [
          projectProgress.inProgress,
          projectProgress.completed,
          projectProgress.notStarted,
        ],
        backgroundColor: ["#007BFF", "#00CFFF", "#E0E0E0"],
        hoverBackgroundColor: ["#0056b3", "#0099cc", "#c6c6c6"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const ProfitOrLossSummaryOnchange = async (date) => {
    setSelectedDate(date);
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const year = selectedDate.getFullYear();
    var Response = await IndianFinanceService.fcnGetProfitOrLossSummanry(year);
    if (Response.isSuccess) {
      setProfitOrLossSummary(Response.item);
    }
  };
  const fillMonthData = (ProfitOrLossSummary) => {
    const profitOrLossArray = new Array(12).fill(0);
    ProfitOrLossSummary.forEach((item) => {
      const monthIndex = item.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        profitOrLossArray[monthIndex] = item.profitOrLoss;
      }
    });

    return profitOrLossArray;
  };
  const profitOrLossValues = fillMonthData(ProfitOrLossSummary);
  const data3 = {
    labels: [
      `Jan ${Selectedyear}`,
      `Feb ${Selectedyear}`,
      `Mar ${Selectedyear}`,
      `Apr ${Selectedyear}`,
      `May ${Selectedyear}`,
      `Jun ${Selectedyear}`,
      `Jul ${Selectedyear}`,
      `Aug ${Selectedyear}`,
      `Sep ${Selectedyear}`,
      `Oct ${Selectedyear}`,
      `Nov ${Selectedyear}`,
      `Dec ${Selectedyear}`,
    ],
    datasets: [
      {
        data: profitOrLossValues,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$ ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$ ${value}`,
        },
      },
    },
  };
  const NavigateToAddEmployee = () => {
    navigate("/dashboard/AddEmployee");
  };
  const NavigateToAddProject = () => {
    navigate("/dashboard/AddProject");
  };
  const NavigateToAddManageRoles = () => {
    navigate("/dashboard/roles");
  };

  const handleDateChange = async (date) => {
    setSelectedDate1(date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const monthNumber = monthMap[month];
    var response = await USFinanceTeamService.FcnGetRevenueOverView(
      monthNumber,
      year
    );
    var result = response.data;
    if (result.isSuccess) {
      setMonthlyRevenueData(result.item);
      Graph(result);
    } else {
      Graph([]);
    }
  };

  return (
    <div className="DashboardMaindiv">
      <p className="employeeoveriew_content ">Employee Overview</p>

      <div className="row m-0 gap-3 gy-2">
        <div
          className="col-12 col-lg-4 Employeeoverview  "
          style={{ flex: "1" }}
        >
          <p className="ActiveEmployeeContent mt-2">Active Employees</p>
          <div style={{ position: "relative", width: "200px" }}>
            <svg width="100" height="50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#F5F5F5"
                strokeWidth="8"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#4A90E2"
                strokeWidth="8"
                strokeDasharray={`${billablePercentage}, 100`}
              />

              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#F5A623"
                strokeWidth="8"
                strokeDasharray={`${nonBillablePercentage}, 100`}
                strokeDashoffset={-billablePercentage}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: " 83%",
                left: " 48%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <h5 style={{ marginRight: "97px", fontSize: "20px" }}>
                {totalEmployees}
              </h5>
            </div>
            <div
              style={{
                position: "absolute",
                top: "130%",
                left: "24%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <small className="total_employees_content">Total Employees</small>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "68%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "19px",
                    backgroundColor: "#4A90E2",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                ></div>
                <span className="billble_content">{billable} Billable</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "5px",
                    height: "19px",
                    backgroundColor: "#F5A623",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                ></div>
                <span className="billble_content">
                  {nonBillable} Non-Billable
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 Employeeoverview" style={{ flex: "1" }}>
          <div className="mt-2">
            <span className="ActiveEmployeeContent">Employees on Bench</span>

            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 36 36"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#F5F5F5"
                  strokeWidth="2"
                />

                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#4A90E2"
                  strokeWidth="2"
                  strokeDasharray={`${internalPercentage} ${
                    100 - internalPercentage
                  }`}
                  strokeDashoffset={0}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#D3D3D3"
                  strokeWidth="2"
                  strokeDasharray={`${noProjectsPercentage} ${
                    100 - noProjectsPercentage
                  }`}
                  strokeDashoffset={`-${internalPercentage}`}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "26%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  padding: "0",
                  margin: "0",
                }}
              >
                <small className="bench_Employee-Progress">{totalBench}</small>
              </div>
              <span
                className="total_employees_content "
                style={{
                  position: "absolute",
                  top: "40%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                Employees
              </span>
              <span
                className="total_employees_content"
                style={{
                  position: "absolute",
                  top: "52%",
                  left: " 39%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                on Bench
              </span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: " 70%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "19px",
                  backgroundColor: "#4A90E2",
                  marginRight: "5px",
                  borderRadius: "5px",
                }}
              ></div>
              <span className="billble_content ms-2">{internal} Internal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "5px",
                  height: "19px",
                  backgroundColor: "#D3D3D3",
                  borderRadius: "5px",
                }}
              ></div>
              <span className="billble_content ms-2">
                {noProjects} No Projects
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 Employeeoverview" style={{ flex: "1" }}>
          <div className="mt-2">
            <p className="ActiveEmployeeContent"> Total Employees</p>
          </div>
          <div
            className="total_employee_content"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 18px",
            }}
          >
            <span style={{ fontSize: "20px" }} className="lastrowcontent">
              {totalEmployees}
            </span>
            <span style={{ fontSize: "14px" }} className="lastrowcontent">
              Active Employees
            </span>
          </div>
          <div
            className="total_employee_content1"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 18px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "20px" }} className="lastrowcontent">
              {totalBench}
            </span>
            <span style={{ fontSize: "14px" }} className="lastrowcontent">
              Employees on Bench
            </span>
          </div>
        </div>
      </div>

      <div className="Project_OverView ">
        <div
          className="row g-3"
          style={{ display: "flex", alignItems: "stretch" }}
        >
          <div className=" col-md-12 col-lg-4  d-flex flex-column">
            <p className="projectOverview_content">Project Overview</p>

            <div className=" Project_progress11 ps-1 pe-1 flex-grow-1">
              <div className="">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="Active_project_conetnt">
                    Active Projects
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    margin: "0",
                    position: "relative",
                    marginLeft: "50px",
                    marginTop: "25px",
                    justifyContent: "center",
                    width: "75%",
                    height: "250px",
                  }}
                >
                  <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                    className="activeEmployees"
                  >
                    Active Projects
                  </p>
                  <Doughnut data={data} options={options} />
                </div>
              </div>
              <div
                style={{
                  marginTop: "90px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div
                  className="mb-2"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#007BFF",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span
                    style={{ fontSize: "13px" }}
                    className="ActiveProject_Inprogress_notstated"
                  >
                    In Progress
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#00CFFF",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span
                    style={{ fontSize: "13px" }}
                    className="ActiveProject_Inprogress_notstated"
                  >
                    Completed
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#E0E0E0",
                      borderRadius: "50%",
                    }}
                  ></span>
                  <span
                    style={{ fontSize: "13px" }}
                    className="ActiveProject_Inprogress_notstated"
                  >
                    Not Started
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-8 d-flex flex-column">
            <p className="projectOverview_content">Revenue Overview</p>
            <div className="Project_progress flex-grow-1">
              <div
                className="pt-2 pe-4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <DatePicker
                  selected={selectedDate1}
                  onChange={handleDateChange}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  maxDate={
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() - 1,
                      1
                    )
                  }
                  className="timesheet-datepicker"
                  customInput={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        padding: "2px 20px",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        fontSize: "14px",
                        height: "28px",
                        width: "130px",
                      }}
                    >
                      <span style={{ marginRight: "6px" }}>
                        <img
                          src={calenderImage1}
                          alt="calendar"
                          height="16px"
                          width="16px"
                        />
                      </span>
                      <span>
                        {selectedDate1.toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  }
                />
              </div>

              <div
                style={{
                  width: "96%",
                }}
              >
                <canvas
                  ref={barchartref}
                  className="indian-finance-revneue-overview1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Profit_And_Loss_Summary">
        <div
          className="row g-3"
          style={{ display: "flex", alignItems: "stretch" }}
        >
          <div className="col-md-12 col-lg-8 d-flex flex-column">
            <span className="projectOverview_content">
              Profit And loss Summary
            </span>

            <div className="Profit_and_loss_flowchat mt-3 flex-grow-1">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 20px",
                }}
              >
                <span className="adminName" style={{ fontSize: "14px" }}>
                  Profit And loss Summary-{Selectedyear}
                </span>
                <div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => ProfitOrLossSummaryOnchange(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Select a year"
                    className="form-control"
                  />
                </div>
              </div>
              <div
                className="m-5"
                style={{
                  width: "85%",
                  border: "1px solid",
                }}
              >
                <ChartJSBar data={data3} options={options3} />
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 d-flex flex-column">
            <span className="projectOverview_content ">Recent Activities</span>
            <div className="recentActivities mt-3 flex-grow-1">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 20px",
                }}
              >
                <span className="adminName" style={{ fontSize: "14px" }}>
                  Latest update
                </span>
              </div>
              {sortedRecentActivities.length > 0 && (
                <div className="latest_updatesImage row ">
                  {sortedRecentActivities.slice(0, 5).map((activity, index) => {
                    let title = "";
                    let actionText = "";
                    let imageSrc = "";
                    let performedBy = activity.performedBy;
                    const action = activity.action;
                    const actionType = action.split(":")[0];
                    if (activity.entityName === "Project") {
                      title = "Project Updated";
                      actionText = actionType + " " + "Project";
                      imageSrc = UpdateProjectImahe;
                    } else if (activity.entityName === "Employee") {
                      if (actionType === "Added") {
                        title = "Employee Updated";
                        actionText = actionType + " " + "new employee";
                      } else if (actionType === "Updated") {
                        actionText = actionType + " " + "employee";
                      } else {
                        actionText = actionType + " " + "employee";
                      }

                      imageSrc = RecentEmployeeImage;
                    } else if (activity.entityName === "Role") {
                      title = "Role Modified";
                      actionText = actionType + " ";
                    } else if (activity.entityName === "ProjectEmployee") {
                      if (actionType == "Added") {
                        actionText = "Team member added";
                        imageSrc = teamMemberAdded;
                      } else {
                        actionText = "Team member removed";
                        imageSrc = teamMemberAdded;
                      }
                    } else {
                      return null;
                    }

                    return (
                      <div className="row m-0 mt-4 Activityrow" key={index}>
                        <div className="col-2">
                          {activity.entityName === "Project" ? (
                            <div
                              style={{
                                height: "38px",
                                width: "38px",
                                backgroundColor: "#875fc0",
                                borderRadius: "100px",
                                position: "relative",
                              }}
                            >
                              <img
                                src={UpdateProjectImahe}
                                alt=""
                                style={{
                                  position: "absolute",
                                  top: "25%",
                                  left: "25%",
                                }}
                              />
                            </div>
                          ) : activity.entityName === "Employee" ? (
                            <div>
                              <img
                                src={RecentEmployeeImage}
                                alt=""
                                height="38px"
                                width="38px"
                              />
                            </div>
                          ) : activity.entityName === "ProjectEmployee" ? (
                            <div>
                              <div
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  backgroundColor: "#45C4F4",
                                  borderRadius: "100px",
                                  position: "relative",
                                }}
                              >
                                <img
                                  src={TeamMemberAddedImage}
                                  alt=""
                                  style={{
                                    position: "absolute",
                                    top: "25%",
                                    left: "25%",
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div>
                                <img
                                  src={RecentEmployeeImage}
                                  alt=""
                                  height="38px"
                                  width="38px"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-7">
                          <span className="Project_Updated_Span">
                            {actionText}
                          </span>
                          <div style={{ display: "flex" }}>
                            <span
                              className="project_updated_name"
                              style={{ fontSize: "13px" }}
                            >
                              {performedBy}
                            </span>
                            <span
                              className="updated_task_content "
                              style={{ fontSize: "13px" }}
                            >
                              Updated a task
                            </span>
                          </div>
                        </div>
                        <div className="col-3 p-0">
                          <span
                            className="updated_time timeStamp"
                            style={{ fontSize: "13px" }}
                          >
                            {getRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div
                style={{
                  border: "1px solid #64646430",
                  width: "100%",
                  marginTop: "60px",
                }}
              ></div>
              <div className="viewAlldiv">
                <button onClick={ViewAll}>
                  <span
                    className="ViewAll"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                  >
                    View All
                    <i
                      className="bi bi-arrow-right ms-1"
                      height="12px"
                      width="12px"
                    ></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: "30px" }}>
        <div style={{ paddingBottom: "20px" }} className="">
          <span className="projectOverview_content ">Quick Actions</span>
        </div>
        <div
          className="Quick_Actions_div  row"
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <div
            className="addEmployee_quick_action col-md-12 col-lg-4"
            onClick={NavigateToAddEmployee}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddEmployeeQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Employee</span>
              </div>
            </div>
          </div>
          <div
            className="addEmployee_quick_action col-md-12 col-lg-4"
            onClick={NavigateToAddProject}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AddProjectQuickAction}
                  alt=""
                  height="52px"
                  width="52px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Add Project</span>
              </div>
            </div>
          </div>
          <div
            className="addEmployee_quick_action col-md-12 col-lg-4"
            onClick={NavigateToAddManageRoles}
          >
            <div className="Quick_Actions_image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={Manageroles} alt="" height="52px" width="52px" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="Add_Employee_content">Manage Roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
