import "../../../src/assets/Styles/USfinanceDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calenderImage from "../../assets/Images/calendar_11919171.png";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import calenderImage1 from "../../assets/Images/calendar_11919171.png";
import { CommonSeriesSettings } from "devextreme-react/chart";
import { registerGradient } from "devextreme/common/charts";
import Chart from "chart.js/auto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { addMonths } from "date-fns";
import { apiurl } from "../../Service/createAxiosInstance";
import USFinanceTeamService from "../../Service/USFinanceTeamService/USFinanceTeamService";
export default function UsFinanceTeamDashboard() {
  const chartref = useRef(null);
  const barchartref = useRef(null);
  const chartref2 = useRef(null);
  const chartintance = useRef(null);
  const chartintance1 = useRef(null);
  const chartintance2 = useRef(null);
  const barchartintance = useRef(null);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [submitedTimesheet, setsubmitedTimesheet] = useState("70%");
  const [NotsubmitedTimesheet, setNotsubmitedTimesheet] = useState("30%");
  const [selectedDate1, setSelectedDate1] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [RevenueValues, setRevneuValues] = useState();
  const [ProjectNames, setProjectNames] = useState([]);
  const [
    BillbleNonBillableEmployeePercentage,
    setBillbleNonBillableEmployeePercentage,
  ] = useState({});
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(today);
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
    FetchData();
  }, []);
  const handleDateChange1 = async (date) => {
    setSelectedDate(date);
  };
  const FetchData = async () => {
    var response =
      await USFinanceTeamService.GetbillableAndNonbillablePercentage();

    setBillbleNonBillableEmployeePercentage(response);
  };

  const [activeIndex, setActiveIndex] = useState(-1);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const data1 = {
    labels: ["Submitted Timesheet", "Timesheet Not Submitted"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#2d9cdb", "#f2994a"],
        hoverBackgroundColor: ["#1d7cb3", "#e0873e"],
        borderWidth: 0,
      },
    ],
  };

  const options1 = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const data = [
    { name: "Submitted Timesheet", value: 70, color: "#1E73DC" },
    { name: "Timesheet Not Submitted", value: 30, color: "#F67D3B" },
  ];

  const data11 = [
    {
      name: "Billable Employees",
      value: Number(
        BillbleNonBillableEmployeePercentage?.item?.billablePercentage?.toFixed(
          2
        )
      ),
      color: "#F5F5F5",
    },
    {
      name: "Non Billable Employees",
      value: Number(
        BillbleNonBillableEmployeePercentage?.item?.nonBillablePercentage?.toFixed(
          2
        )
      ),
      color: "#1E73DC",
    },
  ];
  // const data11 = [
  //   {
  //     name: "Billable Employees",
  //     value: BillbleNonBillableEmployeePercentage.item.billablePercentage,
  //     color: "#F5F5F5",
  //   },
  //   {
  //     name: "Non Billable Employees",
  //     value: BillbleNonBillableEmployeePercentage.item.nonBillablePercentage,
  //     color: "#1E73DC",
  //   },
  // ];
  const COLORS = ["#FDCB58", "#D3D3D3"];
  const seriesColor = {
    base: "#f5564a",
    fillId: registerGradient("linear", {
      colors: [
        {
          offset: "20%",
          color: "#97c95c",
        },
        {
          offset: "90%",
          color: "#eb3573",
        },
      ],
    }),
  };
  const barChartOptions = {
    data: [
      { category: "GXO", revenue: 1500 },
      { category: "cianahealth", revenue: 1000 },
      { category: "EDR", revenue: 2000 },
      { category: "XPO", revenue: 2800 },
      { category: "Title", revenue: 500 },
      { category: "Title", revenue: 1800 },
      { category: "Title", revenue: 1300 },
    ],
    series: [
      {
        type: "bar",
        xKey: "category",
        yKey: "revenue",
        fill: ({ datum }) => (datum.revenue === 2800 ? "#0066FF" : "#CBD5E1"),
        tooltip: {
          renderer: ({ datum }) => ({
            title: "Project Revenue",
            content: `$${datum.revenue}`,
          }),
        },
      },
    ],
    legend: { enabled: false },
    axes: [
      { type: "category", position: "bottom", title: { text: "" } },
      { type: "number", position: "left", title: { text: "$ Revenue" } },
    ],
  };

  const pieChartOptions = {
    data: [
      { category: "Completed", value: 70 },
      { category: "Pending", value: 30 },
    ],
    series: [
      {
        type: "pie",
        angleKey: "value",
        labelKey: "category",
        fills: ["#FACC15", "#CBD5E1"],
        innerRadius: 0,
      },
    ],
    legend: { enabled: true },
  };
  useEffect(() => {
    if (chartintance.current) {
      chartintance.current.destroy();
    }
    const myChartRef = chartref.current.getContext("2d");
    chartintance.current = new Chart(myChartRef, {
      type: "pie",
      data: {
        datasets: [
          {
            data: [300, 50],
            backgroundColor: ["rgb(217, 217, 212)", "rgb(221, 232, 70)"],
            hoverOffset: 4,
          },
        ],
      },
    });
    return () => {
      if (chartintance.current) {
        chartintance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chartintance2.current) {
      chartintance2.current.destroy();
    }
    const myChartRef = chartref2.current.getContext("2d");
    chartintance2.current = new Chart(myChartRef, {
      type: "pie",
      data: {
        datasets: [
          {
            data: [300, 50],
            backgroundColor: ["rgb(54, 162, 235)", "rgb(244, 85, 85)"],
            hoverOffset: 4,
          },
        ],
      },
    });
    return () => {
      if (chartintance2.current) {
        chartintance2.current.destroy();
      }
    };
  }, []);
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
  const Graph = (result) => {
    if (barchartintance.current) {
      barchartintance.current.destroy();
    }
    const myChartRef = barchartref.current.getContext("2d");
    let Projects;
    let revenueValues;
    let dataValues;
    let highestValue;
    let barcolors;
    if (result.isSuccess) {
      Projects = result.item.map((data) => data.projectName);
      revenueValues = result.item.map((data) => data.totalRevenue);
      dataValues = revenueValues;
      highestValue = Math.max(...dataValues);
      barcolors = dataValues.map((value) => {
        return value === highestValue ? "#335CFF" : "#DCE6EF";
      });
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
            maxBarThickness: 50,
            categoryPercentage: 10,
            barPercentage: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 700000,
            grid: {
              color: "#E0E0E0",
              drawBorder: true,
            },
            ticks: {
              font: {
                size: 16,
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
              display: false,
              color: "#A5AEB4",
              borderDash: [5, 5],
            },
            ticks: {
              font: {
                size: 16,
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
  useEffect(() => {
    handleDateChange(selectedDate1);
  }, [selectedDate1]);

  return (
    <div>
      <div>
        <span className="Dashboard-paragrapha">Dashboard</span>
      </div>
      <div className="row">
        <div style={{ marginTop: "15px", fontSize: "14px" }} className="col-4">
          Today, <strong>{formattedDate}</strong>
        </div>
        <div className="col-5 "></div>
        <div
          className="col-3 "
          style={{ display: "flex", justifyContent: "end" }}
        >
          <DatePicker
            selected={selectedDate1}
            onChange={handleDateChange1}
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
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  <img src={calenderImage1} alt="" height="20px" width="20px" />
                </span>

                <span>
                  {selectedDate1.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            }
          />
        </div>
      </div>
      <div style={{ marginTop: "15px" }}>
        <span className="project-uodate-content">Project Update</span>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-3 m-0">
        <div className="col d-flex justify-content-center">
          <div className="Project_progress1">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <canvas
                  ref={chartref}
                  style={{ width: "100px", height: "50px" }}
                />
              </div>
              <div>
                <div className="dropdown mt-3 ms-4">
                  <button
                    className="dropdown-toggle this_month_content"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: "#989898", fontSize: "14px" }}
                  >
                    This Month
                  </button>
                  <ul
                    className="dropdown-menu custom-dropdown-widt w-50"
                    aria-labelledby="dropdownMenuButton1"
                    style={{ width: "100px" }}
                  >
                    <li>
                      <a className="dropdown-item dropdownitems" href="#">
                        Yearly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Monthly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Weekly
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 me-3">
                  <span className="total_projects_content">
                    <span
                      style={{ fontSize: "18px", color: "black" }}
                      className="me-2"
                    >
                      12
                    </span>
                    Total Projects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col d-flex justify-content-center">
          <div className="Project_progress1">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <canvas
                  ref={chartref2}
                  style={{ width: "100px", height: "50px" }}
                />
              </div>
              <div>
                <div className="dropdown mt-3 ms-4">
                  <button
                    className="dropdown-toggle this_month_content"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: "#989898", fontSize: "14px" }}
                  >
                    This Month
                  </button>
                  <ul
                    className="dropdown-menu custom-dropdown-widt w-50"
                    aria-labelledby="dropdownMenuButton1"
                    style={{ width: "100px" }}
                  >
                    <li>
                      <a className="dropdown-item dropdownitems" href="#">
                        Yearly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Monthly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Weekly
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 me-3">
                  <span className="total_projects_content">
                    <span
                      style={{ fontSize: "18px", color: "black" }}
                      className="me-2"
                    >
                      08
                    </span>
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col d-flex justify-content-center">
          <div className="Project_progress1">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div
                  className="circle"
                  style={{
                    position: "relative",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                    marginLeft: "15px",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    100
                  </span>
                </div>
              </div>
              <div>
                <div className="dropdown mt-3 ms-5">
                  <button
                    className="dropdown-toggle this_month_content"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: "#989898", fontSize: "14px" }}
                  >
                    This Month
                  </button>
                  <ul
                    className="dropdown-menu custom-dropdown-widt w-50"
                    aria-labelledby="dropdownMenuButton1"
                    style={{ width: "100px" }}
                  >
                    <li>
                      <a className="dropdown-item dropdownitems" href="#">
                        Yearly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Monthly
                      </a>
                    </li>
                    <li className="mt-1">
                      <a className="dropdown-item dropdownitems" href="#">
                        Weekly
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 me-3">
                  <span className="total_projects_content">
                    <span
                      style={{ fontSize: "18px", color: "black" }}
                      className="me-2"
                    >
                      01
                    </span>
                    Completed Projects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ marginTop: "50px" }}>
          <span className="upcommingtimesheet">upcoming timesheet</span>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
            className="upcomingtimesheetdiv UpcommingUsfinance"
          >
            <div
              className="flex justify-center items-center"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="row" style={{ width: "100vw" }}>
                <div className="col-6 ">
                  <PieChart width={500} height={400} className="ms-4">
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <svg width="400" height="300">
                      <defs>
                        <filter
                          id="shadow"
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                        >
                          <feDropShadow
                            dx="2"
                            dy="2"
                            stdDeviation="4"
                            floodColor="rgba(0,0,0,0.3)"
                          />
                        </filter>
                      </defs>

                      <circle
                        cx="250"
                        cy="200"
                        r="80"
                        fill="white"
                        filter="url(#shadow)"
                      />

                      <text
                        x="62%"
                        y="75%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18px"
                        fontWeight="bold"
                        fill="#777"
                      >
                        WEEKLY
                      </text>
                      <line
                        x1="332"
                        y1="271"
                        x2="500"
                        y2="401"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="#596365"
                      />
                      <line
                        x1="369"
                        y1="300"
                        x2="502"
                        y2="280"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="#596365"
                      />
                      <text
                        x="62%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18px"
                        fontWeight="bold"
                        fill="#777"
                        className="kjasdsakj"
                      >
                        TIMESHEET
                      </text>
                      <line
                        x1="205"
                        y1="20"
                        x2="150"
                        y2="20"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="block"
                      />
                      <line
                        x1="203"
                        y1="19  "
                        x2="260"
                        y2="70"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="block"
                      />
                    </svg>
                  </PieChart>
                  <div className="absolute text-sm">
                    <div
                      style={{
                        position: "absolute",
                        left: "60px",
                        top: "14%",
                        fontSize: "14px",
                      }}
                    >
                      Submitted Timesheet
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "200px",
                        top: "65%",
                        fontSize: "14px",
                      }}
                    >
                      Timesheet Not Submitted
                    </div>
                  </div>
                  <div className="absolute text-sm">
                    <div
                      style={{
                        position: "absolute",
                        left: "190px",
                        top: "40%",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      70%
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "390px",
                        top: "58%",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      30%
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <PieChart width={500} height={400} className="">
                    <Pie
                      data={data11}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={140}
                      dataKey="value"
                      stroke="none"
                    >
                      {data11.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip />

                    <svg width="500" height="400">
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18px"
                        fontWeight="bold"
                        fill="#777"
                      >
                        BILLING
                      </text>
                      <text
                        x="50%"
                        y="52%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18px"
                        fontWeight="bold"
                        fill="#777"
                      >
                        PERFORMANCE
                      </text>

                      <line
                        x1="464"
                        y1="334"
                        x2="356"
                        y2="212"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="#596365"
                      />
                      <line
                        x1="205"
                        y1="20"
                        x2="150"
                        y2="20"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="block"
                      />
                      <line
                        x1="203"
                        y1="19  "
                        x2="260"
                        y2="70"
                        stroke="#514C4C"
                        strokeWidth="4"
                        fill="block"
                      />
                    </svg>
                  </PieChart>
                  <div className="absolute text-sm">
                    <div
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "15%",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "18px",
                        }}
                      >
                        {Number(
                          BillbleNonBillableEmployeePercentage?.item?.billablePercentage?.toFixed(
                            2
                          )
                        )}
                      </span>
                      Billable Employees
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "270px",
                        top: "75%",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "18px",
                        }}
                      >
                        {Number(
                          BillbleNonBillableEmployeePercentage?.item?.nonBillablePercentage?.toFixed(
                            2
                          )
                        )}
                      </span>{" "}
                      Non Billable Employees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Revenue-overview-maindiv">
        <span className="Revenue-overview-span">Revenue Overview</span>
        <div className=" row m-0">
          <div className=" Revenue-overview">
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="p-3"
            >
              <span className="Monthly-overview-content">Revenue Overview</span>

              <div>
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
                        padding: "5px 10px",
                        borderRadius: "5px",
                        backgroundColor: "#fff",
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        <img
                          src={calenderImage1}
                          alt=""
                          height="20px"
                          width="20px"
                        />
                      </span>
                      <span>
                        {selectedDate1.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <canvas ref={barchartref} className="bar-pie-chart " />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
