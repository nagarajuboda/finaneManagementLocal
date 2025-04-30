import "../../assets/Styles/IndiaFinanceDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
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
  const [MonthWiseRevenues, setMonthWiseRevenue] = useState([]);
  const [MonthWiseOverhead, setMonthWisetOverhead] = useState("");
  const [MonthWiseSpecificApportionment, setMonthWisetgeneralApprotionment] =
    useState("");
  const [selectedyear, setSelectedYear] = useState("");
  const [MonthWiseExpenditures, setMonthWiseExpenditures] = useState([]);
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
    const month = selectedDate1.toLocaleString("default", { month: "long" });
    const year = selectedDate1.getFullYear();
    setSelectedYear(year);
    handleDateChange(selectedDate1);
    calculateValues(MonthlyRevenue, MonthlyExpenses);
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
      setMonthlyRevenue(BalanceRevenueExpensesResponse.item.totalRevenue);
      setMonthlyExpenses(BalanceRevenueExpensesResponse.item.totalExpenses);
      setTotalbalance(BalanceRevenueExpensesResponse.item.totalBalance);
      setMonthWisetOverhead(BalanceRevenueExpensesResponse.item.overhead);
      setMonthWisetgeneralApprotionment(
        BalanceRevenueExpensesResponse.item.generalApportionment
      );
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
    var RevenuesExpenditureResponse =
      await IndianFinanceService.fcnGetRevenueExpenditures(year);
    if (RevenuesExpenditureResponse.isSuccess) {
      setMonthWiseRevenue(RevenuesExpenditureResponse.item.monthWiseRevenue);
      setMonthWiseExpenditures(
        RevenuesExpenditureResponse.item.monthWiseExpenses
      );
    }
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const revenueData = new Array(12).fill(0);
  const expensesData = new Array(12).fill(0);
  MonthWiseRevenues.forEach((item) => {
    const index = item.month - 1;
    revenueData[index] = item.totalRevenue;
  });

  MonthWiseExpenditures.forEach((item) => {
    const index = item.month - 1;
    expensesData[index] = item.totalExpenses;
  });

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
              display: false,
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
              strokeDasharray: [4, 4],
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
            ctx.fill();
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
    { value: MonthWiseSpecificApportionment, color: "#855FC0" },
    { value: MonthWiseOverhead, color: "#FFD8D8" },
  ];
  const calculateValues = (revenue, expenses) => {
    if (revenue === 0)
      return {
        margin: 0,
        expensesPercentage: 0,
        profit: 0,
        profitPercentage: 0,
      };

    const profit = revenue - expenses;
    const margin = (profit / revenue) * 100;
    const expensesPercentage = (expenses / revenue) * 100;
    const profitPercentage = (profit / revenue) * 100;

    return {
      margin: margin.toFixed(2),
      expensesPercentage: expensesPercentage.toFixed(2),
      profit: profit.toFixed(2),
      profitPercentage: profitPercentage.toFixed(2),
    };
  };
  const { margin, expensesPercentage, profit, profitPercentage } =
    calculateValues(MonthlyRevenue, MonthlyExpenses);
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

  const transformData = (monthWiseRevenues, monthWiseExpenditures) => {
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const month = selectedDate1.toLocaleString("default", { month: "long" });
    const year = selectedDate1.getFullYear();
    const revenueData = months.map((month) => {
      const entry = monthWiseRevenues.find((item) => item.month === month);
      return {
        x: new Date(year, month - 1, 1).getTime(),
        y: entry ? entry.totalRevenue : 0,
      };
    });

    const expenditureData = months.map((month) => {
      const entry = monthWiseExpenditures.find((item) => item.month === month);
      return {
        x: new Date(year, month - 1, 1).getTime(),
        y: entry ? entry.totalExpenses : 0,
      };
    });

    return { revenueData, expenditureData };
  };
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Revenues",
        data: [],
        type: "area",
      },
      {
        name: "Expenditures",
        data: [],
        type: "line",
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
        enabledOnSeries: [1],
        formatter: function (val) {
          return (val / 1000000).toFixed(1);
        },
        style: {
          fontSize: "12px",
          colors: ["#000"],
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          borderRadius: 2,
          padding: 4,
          opacity: 0.9,
        },
        offsetY: -10,
      },
      stroke: {
        curve: "smooth",
        width: [2, 3],
      },
      markers: {
        size: [4, 5],
        colors: ["#FF4560"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      title: {
        text: "Consolidated Overview",
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
        intersect: true,
        x: {
          format: "MMM",
        },
        y: {
          formatter: function (val, opts) {
            if (opts.seriesIndex === 0) {
              return "$" + " " + val.toLocaleString();
            } else if (opts.seriesIndex === 1) {
              return "$" + " " + val.toLocaleString();
            }
            return val;
          },
        },
      },
    },
  });

  useEffect(() => {
    const { revenueData, expenditureData } = transformData(
      MonthWiseRevenues,
      MonthWiseExpenditures
    );

    setChartData((prev) => ({
      ...prev,
      series: [
        {
          ...prev.series[0],
          data: revenueData,
        },
        {
          ...prev.series[1],
          data: expenditureData,
        },
      ],
    }));
  }, [MonthWiseRevenues, MonthWiseExpenditures]);
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
              <span className="Total-balance-amout">{`$ ${TotalBalance.toFixed(
                2
              )}`}</span>
            </div>

            <div className=" ">
              <span className="Total-balance-amout">{`${profitPercentage}%`}</span>
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
              <span className="Total-balance-amout">{`${profitPercentage}%`}</span>
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
              <span className="Total-balance-amout">{`$ ${MonthlyExpenses.toFixed(
                2
              )}`}</span>
            </div>
            <div className="">
              <span className="Total-balance-amout">{`${expensesPercentage}%`}</span>
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
              <PieCenterLabel className="">{`$ ${MonthlyExpenses.toFixed(
                2
              )}`}</PieCenterLabel>
            </PieChart>
          </div>
          <div className="row m-0 legend" style={{ paddingTop: "20px" }}>
            <div className="col-4  legend-item">
              <div class="color-box overhead"></div>
              <span style={{ fontSize: "12px" }}>Overhead</span>
            </div>
            <div className="col-8  legend-item">
              <div class="color-box general"></div>
              <span style={{ fontSize: "12px" }}>General Apportionment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <span className="profit-or-loss-summary-contant">
          Profit And Loss Summary
        </span>
        <div className="profit-or-loss-summary-linebar mt-3">
          <div id="chart ">
            <div
              style={{
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <LineChart
                xAxis={[
                  {
                    data: months,
                    scaleType: "point",
                  },
                ]}
                yAxis={[
                  {
                    tickMinStep: Infinity,
                    label: "",
                    disableLine: true,
                  },
                ]}
                series={[
                  {
                    data: revenueData,
                    label: "Revenues",
                    color: "rgba(25, 118, 210, 1)",
                  },
                  {
                    data: expensesData,
                    label: `Expenditures - ${selectedyear}`,
                    color: "rgba(211, 47, 47, 1)",
                  },
                ]}
                grid={{
                  horizontal: true,
                  vertical: false,
                }}
                legend={{
                  position: {
                    display: "flex",
                    vertical: "top",
                    horizontal: "left",
                  },
                  itemMarkWidth: 12,
                  itemGap: 10,
                }}
                height={300}
                sx={{
                  ".MuiChartsGrid-line": {
                    stroke: "#ccc",
                    strokeWidth: 1,
                    strokeDasharray: "4, 5",
                  },
                }}
              />
            </div>
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
                        ${emp.totalExpenses.toFixed(2)}
                      </td>
                      <td style={{ fontSize: "14px" }}>
                        ${emp.profitOrLoss.toFixed(2)}
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
