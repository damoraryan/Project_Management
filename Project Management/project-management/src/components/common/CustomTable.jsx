import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TableSortLabel, Button, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toast import
import "react-toastify/dist/ReactToastify.css";
import "../../assets/viewprojecttable.css";

export const CustomTable = ({
  data,
  columns,
  onDelete,
  editPath,
  viewPath,
  showEdit = true,
  entityType,
  statusOptions = null,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key, direction: "asc" });
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();

  const defaultStatuses = [
    "Pending",
    "In Progress",
    "On Hold",
    "Review",
    "Approved",
    "Rejected",
    "Completed",
  ];

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get("/status");
        const map = {};
        res.data.data.forEach(status => {
          if (status.entityType === entityType) {
            map[status.entityId] = { statusName: status.statusName, _id: status._id };
          }
        });
        setStatusMap(map);
      } catch (err) {
        toast.error("Failed to fetch statuses");
      }
    };
    fetchStatuses();
  }, [data, entityType]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const colType = columns.find((col) => col.key === sortConfig.key)?.type;
    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (colType === "date") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleStatusChange = async (entityId, newStatus, statusId) => {
    const role = localStorage.getItem("role") || "USER";
    try {
      if (statusId) {
        await axios.put(`/updateStatus/${statusId}`, { statusName: newStatus });
        toast.success("Status updated successfully");
      } else {
        await axios.post("/status", {
          entityId,
          entityType,
          role,
          statusName: newStatus,
        });
        toast.success("Status created successfully");
      }
      window.location.reload();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const getAddPath = () => {
    switch (entityType) {
      case "project":
        return "/admin/project";
      case "projectModule":
        return "/admin/projectmodule";
      case "task":
        return "/admin/task";
      case "user":
        return "/admin/projectteam";
      default:
        return "/";
    }
  };

  return (
    <div>
      {/* Add entity button */}
      <div className="add-entity-button-container" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate(getAddPath())}
        >
          Add {entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : "Entity"}
        </Button>
      </div>

      {/* Table Container */}
      <TableContainer component={Paper} className="mui-table">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <TableSortLabel
                    active={sortConfig.key === col.key}
                    direction={sortConfig.key === col.key ? sortConfig.direction : "asc"}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.map((row) => {
              const statusInfo = statusMap[row._id];
              const currentStatus = statusInfo?.statusName || "Pending";
              const statusId = statusInfo?._id;

              return (
                <TableRow key={row._id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.type === "date"
                        ? new Date(row[col.key]).toLocaleDateString()
                        : row[col.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(row._id, e.target.value, statusId)}
                      size="small"
                      className={`status-dropdown ${
                        currentStatus === "Pending"
                          ? "status-pending"
                          : currentStatus === "In Progress"
                          ? "status-inprogress"
                          : currentStatus === "Completed"
                          ? "status-completed"
                          : currentStatus === "Review"
                          ? "status-review"
                          : currentStatus === "Approved"
                          ? "status-approved"
                          : currentStatus === "Rejected"
                          ? "status-rejected"
                          : "status-onhold"
                      }`}
                    >
                      {(statusOptions || defaultStatuses).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === "Pending" && "🟠 Pending"}
                          {status === "In Progress" && "🟡 In Progress"}
                          {status === "On Hold" && "⏸️ On Hold"}
                          {status === "Review" && "🔵 Review"}
                          {status === "Approved" && "✅ Approved"}
                          {status === "Rejected" && "❌ Rejected"}
                          {status === "Completed" && "🟢 Completed"}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell>
                    {showEdit && (
                      <Link to={`${editPath}/${row._id}`}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{ marginRight: "10px" }}
                        >
                          <EditIcon />
                        </Button>
                      </Link>
                    )}
                    <Link
                      to={typeof viewPath === "function" ? viewPath(row) : `${viewPath}/${row._id}`}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginRight: "10px" }}
                      >
                        <VisibilityIcon />
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => onDelete(row._id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomTable;
