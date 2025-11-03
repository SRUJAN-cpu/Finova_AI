import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ data }) {
  if (!data) return null;

  console.log("Dashboard received data:", data);

  // Extract data - fully generic to handle any company financial data
  const analysis = data.analysis || {};
  const intake = data.intake || {};
  const suggestions = data.suggestions || [];
  const anomalies = data.anomalies || [];
  const duplicates = data.duplicates || [];
  const chatContext = data.chat_context || "";

  // Dynamically find all numeric fields in analysis for summary cards
  const numericFields = {};
  Object.entries(analysis).forEach(([key, value]) => {
    if (typeof value === "number") {
      numericFields[key] = value;
    }
  });

  // Find all trend/category data (objects with numeric values)
  const trendData = {};
  Object.entries(analysis).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0 &&
      typeof Object.values(value)[0] === "number"
    ) {
      trendData[key] = value;
    }
  });

  // Get primary trend for line chart (prefer monthly/weekly/time-based trends)
  const primaryTrendKey =
    Object.keys(trendData).find(
      (k) =>
        k.includes("monthly") ||
        k.includes("weekly") ||
        k.includes("trend") ||
        k.includes("time")
    ) || Object.keys(trendData)[0];
  const primaryTrend = primaryTrendKey ? trendData[primaryTrendKey] : {};
  const primaryTrendLabels = Object.keys(primaryTrend);
  const primaryTrendValues = Object.values(primaryTrend);

  // Get category breakdown for bar chart (prefer category/department/type breakdowns)
  const categoryKey =
    Object.keys(trendData).find(
      (k) =>
        k.includes("categor") ||
        k.includes("department") ||
        k.includes("type") ||
        k.includes("breakdown")
    ) || Object.keys(trendData).find((k) => k !== primaryTrendKey);
  const categoryData = categoryKey ? trendData[categoryKey] : {};
  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  // Format field names for display (snake_case to Title Case)
  const formatFieldName = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format currency with rupee symbol or just number
  const formatValue = (value) => {
    if (value >= 1000) {
      return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString();
  };

  return (
    <section className="dashboard">
      <h2>Financial Analysis Results</h2>
      {intake.key && (
        <p style={{ color: "#9fb3c8", marginBottom: "20px" }}>
          File: {intake.key} {intake.filetype ? `(${intake.filetype})` : ""}
        </p>
      )}

      {/* Dynamic summary cards for all numeric fields */}
      {Object.keys(numericFields).length > 0 && (
        <div className="cards">
          {Object.entries(numericFields)
            .slice(0, 4)
            .map(([key, value]) => (
              <div className="card" key={key}>
                <h3>{formatFieldName(key)}</h3>
                <div className="value">{formatValue(value)}</div>
              </div>
            ))}
        </div>
      )}

      {/* Dynamic charts - adapt to available data */}
      {(primaryTrendLabels.length > 0 || categoryLabels.length > 0) && (
        <div className="charts">
          {primaryTrendLabels.length > 0 && (
            <div className="chart">
              <h4>{formatFieldName(primaryTrendKey || "Trend Analysis")}</h4>
              <Line
                data={{
                  labels: primaryTrendLabels,
                  datasets: [
                    {
                      label: "Amount",
                      data: primaryTrendValues,
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59,130,246,0.2)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}

          {categoryLabels.length > 0 && (
            <div className="chart">
              <h4>{formatFieldName(categoryKey || "Category Breakdown")}</h4>
              <Bar
                data={{
                  labels: categoryLabels,
                  datasets: [
                    {
                      label: "Amount",
                      data: categoryValues,
                      backgroundColor: [
                        "#ef4444",
                        "#f59e0b",
                        "#10b981",
                        "#3b82f6",
                        "#8b5cf6",
                        "#ec4899",
                        "#06b6d4",
                        "#84cc16",
                        "#f97316",
                        "#6366f1",
                        "#14b8a6",
                        "#f43f5e",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Insights section */}
      <div className="insights">
        {suggestions.length > 0 && (
          <>
            <h4>💡 Recommendations ({suggestions.length})</h4>
            <ul>
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}

        {anomalies.length > 0 && (
          <>
            <h4>⚠️ Anomalies Detected ({anomalies.length})</h4>
            <ul>
              {anomalies.slice(0, 5).map((a, i) => {
                // Handle both object and string anomalies
                if (typeof a === "string") {
                  return <li key={i}>{a}</li>;
                }
                // For object anomalies, show key details
                return (
                  <li key={i}>
                    {a.Date || a.date || ""} -{" "}
                    {a.Category || a.category || "Unknown"} - ₹
                    {(a.Amount || a.amount || a.INR || 0).toLocaleString()}
                    {a.Note && ` - ${a.Note}`}
                  </li>
                );
              })}
            </ul>
            {anomalies.length > 5 && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#9fb3c8",
                  marginTop: "8px",
                }}
              >
                ...and {anomalies.length - 5} more anomalies
              </p>
            )}
          </>
        )}

        {duplicates.length > 0 && (
          <>
            <h4>🔄 Duplicate Transactions ({duplicates.length})</h4>
            <ul>
              {duplicates.slice(0, 3).map((d, i) => (
                <li key={i}>
                  {typeof d === "string"
                    ? d
                    : JSON.stringify(d).substring(0, 100)}
                </li>
              ))}
            </ul>
            {duplicates.length > 3 && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#9fb3c8",
                  marginTop: "8px",
                }}
              >
                ...and {duplicates.length - 3} more duplicates
              </p>
            )}
          </>
        )}
      </div>

      {/* Summary section */}
      {chatContext && (
        <div className="share">
          <h4>📊 Analysis Summary</h4>
          <pre className="summary">{chatContext}</pre>
        </div>
      )}
    </section>
  );
}
