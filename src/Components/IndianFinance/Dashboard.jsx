import "../../assets/Styles/IndiaFinanceDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef, useEffect } from "react";
import { registerGradient } from "devextreme/common/charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import calenderImage1 from "../../assets/Images/calendar_11919171.png";
import ReactApexChart from "react-apexcharts";
import USFinanceTeamService from "../../Service/USFinanceTeamService/USFinanceTeamService";
import IndianFinanceService from "../../Service/IndianFinance/IndianFinanceService";
export default function IndainFinanceDashboard() {
  const [selectedDate1, setSelectedDate1] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const barchartref = useRef(null);
  const barchartintance = useRef(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [MonthlyRevenue, setMonthlyRevenue] = useState(0);
  const [MonthlyExpenses, setMonthlyExpenses] = useState(0);
  const [TotalBalance, setTotalbalance] = useState(0);
  const [EmployeeProfitOrSummaryData, setEmployeeProfitOrSummaryData] =
    useState([]);
  const navigate = useNavigate();
  const today = new Date();
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
    handleDateChange(selectedDate1);
  }, [selectedDate1]);
  const handleDateChange1 = async (date) => {
    setSelectedDate(date);
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
    var BalanceRevenueExpensesResponse =
      await IndianFinanceService.fcnGetBalanceRevenueExpenses(
        monthNumber,
        year
      );
    if (BalanceRevenueExpensesResponse.isSuccess) {
      setMonthlyRevenue(BalanceRevenueExpensesResponse.item.item1);
      setMonthlyExpenses(BalanceRevenueExpensesResponse.item.item2);
      setTotalbalance(BalanceRevenueExpensesResponse.item.item3);
    }
    var employeeProfitOrLossSummaryDataResponse =
      await IndianFinanceService.FcnEmployeeProfitOrLossSummary(
        monthNumber,
        year
      );
    if (employeeProfitOrLossSummaryDataResponse.isSuccess) {
      setEmployeeProfitOrSummaryData(
        employeeProfitOrLossSummaryDataResponse.item
      );
    }
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
            maxBarThickness: 40,
            categoryPercentage: 10,
            barPercentage: 20,
            borderRadius: 5,
          },
        ],
      },
      options: {
        //responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 700000,
            grid: {
              color: (context) =>
                context.tick.value === 0 ? "transparent" : "#A5AEB4",
              borderDash: [4, 4],
              drawBorder: false,
              drawTicks: false,
            },
            border: {
              display: false,
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
              display: false,
              color: "#A5AEB4",
              borderDash: [5, 5],
            },
            border: {
              display: false,
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

            const radius = 30;
            ctx.beginPath();
            ctx.moveTo(chartArea.left + radius, chartArea.top);
            ctx.lineTo(chartArea.right - radius, chartArea.top);
            ctx.quadraticCurveTo(
              chartArea.right,
              chartArea.top,
              chartArea.right,
              chartArea.top + radius
            );
            ctx.lineTo(chartArea.right, chartArea.bottom - radius);
            ctx.quadraticCurveTo(
              chartArea.right,
              chartArea.bottom,
              chartArea.right - radius,
              chartArea.bottom
            );
            ctx.lineTo(chartArea.left + radius, chartArea.bottom);
            ctx.quadraticCurveTo(
              chartArea.left,
              chartArea.bottom,
              chartArea.left,
              chartArea.bottom - radius
            );
            ctx.lineTo(chartArea.left, chartArea.top + radius);
            ctx.quadraticCurveTo(
              chartArea.left,
              chartArea.top,
              chartArea.left + radius,
              chartArea.top
            );
            ctx.closePath();

            ctx.fill(); // Apply background fill
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
  const data = [
    { value: 5, color: "#855FC0" },
    { value: 5, color: "#FFD8D8" },
    { value: 15, color: "#C6FFD2" },
    { value: 20, color: "#60CDF5" },
  ];
  const size = {
    width: 300,
    height: 350,
  };
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 16,
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  const dates = [
    { x: new Date("2024-01-01").getTime(), y: 1200000 },
    { x: new Date("2024-02-02").getTime(), y: 1300000 },
    { x: new Date("2024-03-03").getTime(), y: 1100000 },
    { x: new Date("2024-04-04").getTime(), y: 1400000 },
    { x: new Date("2024-05-01").getTime(), y: 1200000 },
    { x: new Date("2024-06-02").getTime(), y: 1300000 },
    { x: new Date("2024-07-03").getTime(), y: 1100000 },
    { x: new Date("2024-08-04").getTime(), y: 1400000 },
    { x: new Date("2024-09-01").getTime(), y: 1200000 },
    { x: new Date("2024-10-02").getTime(), y: 1300000 },
    { x: new Date("2024-11-03").getTime(), y: 1100000 },
    { x: new Date("2024-12-04").getTime(), y: 1400000 },
  ];
  const date = [
    { x: new Date("2024-01-01").getTime(), y: 120000 },
    { x: new Date("2024-02-02").getTime(), y: 130 },
    { x: new Date("2024-03-03").getTime(), y: 110000 },
    { x: new Date("2024-04-04").getTime(), y: 140000 },
    { x: new Date("2024-05-01").getTime(), y: 1200 },
    { x: new Date("2024-06-02").getTime(), y: 130000 },
    { x: new Date("2024-07-03").getTime(), y: 11000 },
    { x: new Date("2024-08-04").getTime(), y: 140000 },
    { x: new Date("2024-09-01").getTime(), y: 12000 },
    { x: new Date("2024-10-02").getTime(), y: 130000 },
    { x: new Date("2024-11-03").getTime(), y: 110000 },
    { x: new Date("2024-12-04").getTime(), y: 140000 },
  ];
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "XYZ MOTORS",
        data: dates,
        type: "area", // Area chart
      },
      {
        name: "ABC MOTORS",
        data: date,
        type: "line", // Line chart
      },
    ],
    options: {
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: [2, 3], // Different stroke widths for area and line
      },
      markers: {
        size: [0, 5], // Ensure markers are visible for the line chart
        colors: ["#FF4560"], // Marker color for the line
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7, // Make it bigger on hover
        },
      },
      title: {
        text: "Stock Price Movement",
        align: "left",
      },
      fill: {
        type: ["gradient", "solid"],
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: "Price",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: function (value) {
            return new Date(value).toLocaleString("en-US", { month: "short" });
          },
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
      },
    },
  });
  const employees = [
    {
      id: "EMP001",
      name: "Kishna Sharma",
      email: "krishna.sharma@example.com",
      salary: 50000,
      expense: 20000,
      profit: 30000,
    },
    {
      id: "EMP002",
      name: "Priya Mehta",
      email: "priya.mehta@example.com",
      salary: 45000,
      expense: 15000,
      profit: 30000,
    },
    {
      id: "EMP003",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      salary: 60000,
      expense: 25000,
      profit: 35000,
    },
    {
      id: "EMP004",
      name: "Simran Kaur",
      email: "simran.kaur@example.com",
      salary: 55000,
      expense: 18000,
      profit: 37000,
    },
    {
      id: "EMP005",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      salary: 70000,
      expense: 30000,
      profit: 40000,
    },
    {
      id: "EMP006",
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      salary: 48000,
      expense: 22000,
      profit: 26000,
    },
    {
      id: "EMP007",
      name: "Arjun Nair",
      email: "arjun.nair@example.com",
      salary: 52000,
      expense: 19000,
      profit: 33000,
    },
    {
      id: "EMP008",
      name: "Pooja Iyer",
      email: "pooja.iyer@example.com",
      salary: 58000,
      expense: 20000,
      profit: 38000,
    },
    {
      id: "EMP009",
      name: "Ravi Verma",
      email: "ravi.verma@example.com",
      salary: 65000,
      expense: 28000,
      profit: 37000,
    },
    {
      id: "EMP010",
      name: "Anjali Das",
      email: "anjali.das@example.com",
      salary: 40000,
      expense: 12000,
      profit: 28000,
    },
  ];
  const SeeDetails = () => {
    const month = selectedDate1.toLocaleString("default", { month: "long" });
    const year = selectedDate1.getFullYear();
    const monthNumber = monthMap[month];
    navigate(`/dashboard/ProfitSummary?month=${monthNumber}&year=${year}`);
  };
  return (
    <div>
      <div>
        <span className="Dashboard-paragraph">Dashboard</span>
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
          <div>
            <DatePicker
              selected={selectedDate1}
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
      </div>
      <div className="row m-0 d-flex gap-5" style={{ paddingTop: "30px" }}>
        <div className="col total-balance">
          <div className="row">
            <div className="col-12 pt-3">
              <span className="Total-Balance-Span">Total Balance</span>
            </div>
          </div>
          <div
            className="pt-4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="">
              <span className="Total-balance-amout">{`$ ${TotalBalance}`}</span>
            </div>

            <div className=" ">
              <span className="Total-balance-amout">15.28%</span>
            </div>
          </div>
          <div className="row white-line"></div>
          <div
            className="pt-2"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="">
              <span className="see-details">See Details</span>
            </div>

            <div className="">
              <button onClick={SeeDetails}>
                <i
                  class="bi bi-arrow-right"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col monthly-income">
          <div className="row">
            <div className="col-12 pt-3">
              <span className="Total-Balance-Span">Monthly Income</span>
            </div>
          </div>
          <div
            className=" pt-4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className=" ">
              <span className="Total-balance-amout">{`$ ${MonthlyRevenue}`}</span>
            </div>

            <div className="">
              <span className="Total-balance-amout">15.28%</span>
            </div>
          </div>
          <div className="row white-line"></div>
          <div
            className=" pt-2"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="">
              <span className="see-details">See Details</span>
            </div>

            <div className="">
              <button onClick={SeeDetails}>
                <i
                  class="bi bi-arrow-right"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col monthly-expenses">
          <div className="row">
            <div className="col-12 pt-3">
              <span className="Total-Balance-Span">Monthly Expenses</span>
            </div>
          </div>
          <div
            className=" pt-4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="">
              <span className="Total-balance-amout">{`$ ${MonthlyExpenses}`}</span>
            </div>
            <div className="">
              <span className="Total-balance-amout">15.28%</span>
            </div>
          </div>
          <div className="row white-line"></div>
          <div
            className=" pt-2"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="">
              <span className="see-details">See Details</span>
            </div>

            <div className="">
              <button onClick={SeeDetails}>
                <i
                  class="bi bi-arrow-right"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex m-0 w-100"
        style={{ paddingTop: "50px", gap: "40px" }}
      >
        <div className="revenue-summary" style={{ width: "66%" }}>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="p-3"
          >
            <span
              className="Monthly-overview-content"
              style={{ fontSize: "16px" }}
            >
              Revenue Overview
            </span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "15px",
            }}
            className=""
          >
            <canvas
              ref={barchartref}
              className="indian-finance-revneue-overview ms-4 "
            />
          </div>
        </div>
        <div
          className="expenses-overview"
          style={{
            width: "32%",
          }}
        >
          <div className="Monthly-overview-content p-3">
            <span>Expenses Overview</span>
          </div>
          <div
            className=" relative "
            style={{
              display: "flex",
            }}
          >
            <PieChart
              className=""
              series={[
                {
                  data,

                  innerRadius: 80,
                  paddingAngle: 4,
                  cornerRadius: 5,
                  labelPosition: 60,
                  outerRadius: 105,
                },
              ]}
              {...size}
            >
              <PieCenterLabel className="">{`$ ${MonthlyExpenses}`}</PieCenterLabel>
              {/* <div className="absolute top-[50px]  total-expenses-pie-chat-center-lable">
                <PieCenterLabel>Total Expenses</PieCenterLabel>
              </div> */}
            </PieChart>
          </div>
          <div className="row m-0 legend" style={{ paddingTop: "20px" }}>
            <div className="col-3 legend-item">
              <div class="color-box direct"></div>
              <span style={{ fontSize: "12px" }}>Direct</span>
            </div>
            <div className="col-3  legend-item">
              <div class="color-box overhead"></div>
              <span style={{ fontSize: "12px" }}>Overhead</span>
            </div>
            <div className="col-6  legend-item">
              <div class="color-box general"></div>
              <span style={{ fontSize: "12px" }}>General Apportionment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <span className="profit-or-loss-summary-contant ">
          Profit And Loss Summary
        </span>
        <div className="profit-or-loss-summary-linebar mt-3">
          <div id="chart">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height={350}
            />
          </div>
          <div id="html-dist"></div>
        </div>
      </div>
      <div className="profit-or-loss-summary-data mt-5">
        <span className="profit-or-loss-summary-contant ">
          Profit Or loss summary Data
        </span>
        <div className="profit-or-loss-summary-table-data mt-3  ">
          <div style={{ padding: "10px" }}>
            <table
              id="example"
              className="employeeTable"
              style={{ width: "100%" }}
            >
              <thead>
                <tr className="tableheader">
                  <th style={{ fontSize: "14px" }}>Employee ID</th>
                  <th style={{ fontSize: "14px" }}>Employee Name</th>
                  <th style={{ fontSize: "14px" }}>Email</th>
                  <th style={{ fontSize: "14px" }}>Generated Revenue</th>
                  <th style={{ fontSize: "14px" }}>Expenses</th>
                  <th style={{ fontSize: "14px" }}>Profit/Loss</th>
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
                        {emp.employee.employeeId}
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        {emp.employee.firstName} {emp.employee.lastName}
                      </td>
                      <td style={{ fontSize: "14px" }}>{emp.employee.email}</td>
                      <td style={{ fontSize: "14px" }}>
                        ${emp.revenueGenerated.toLocaleString()}
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        ${emp.totalExpenses.toLocaleString()}
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        ${emp.profitOrLoss.toLocaleString()}
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
    </div>
  );
}
