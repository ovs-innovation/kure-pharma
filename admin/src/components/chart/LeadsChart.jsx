import React from "react";
import "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";

export const LeadsBarChart = ({ leadsByDate }) => {
  // Sort leadsByDate by date ascending
  const sortedData = [...(leadsByDate || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = {
    labels: sortedData.map((d) => {
      const parts = d.date.split("-");
      if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return d.date;
    }),
    datasets: [
      {
        label: "Enquiries",
        data: sortedData.map((d) => d.count),
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export const LeadsDoughnutChart = ({ leadsByStatus }) => {
  const statusColors = {
    pending: "#FBBF24",     // Yellow
    contacted: "#3B82F6",   // Blue
    in_progress: "#8B5CF6", // Purple
    completed: "#10B981",   // Green
    cancelled: "#EF4444",   // Red
  };

  const labels = (leadsByStatus || []).map((s) => {
    const status = s._id || "pending";
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  });

  const dataValues = (leadsByStatus || []).map((s) => s.count);
  const backgroundColors = (leadsByStatus || []).map(
    (s) => statusColors[s._id] || "#6B7280"
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};
