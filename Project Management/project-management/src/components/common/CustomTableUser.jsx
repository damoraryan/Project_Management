import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TableSortLabel, Select, MenuItem, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/viewprojecttable.css";

export const CustomTableUser = ({
  data,
  columns,
  viewPath,
  entityType = "task",
  statusOptions = ["Pending", "In Progress", "Completed"],
}) => {
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key, direction: "asc" });
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get("/status");
        const map = {};
        res.data.data.forEach((status) => {
          if (status.entityType === entityType) {
            map[status.entityId] = { statusName: status.statusName, _id: status._id };
          }
        });
        setStatusMap(map);
      } catch (err) {
        if (!toast.isActive("fetchStatusError")) {
          toast.error("Failed to fetch statuses", { toastId: "fetchStatusError" });
        }
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
    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (typeof valueA === "string") valueA = valueA.toLowerCase();
    if (typeof valueB === "string") valueB = valueB.toLowerCase();

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleStatusChange = async (entityId, newStatus, statusId) => {
    const role = localStorage.getItem("role") || "USER";
    const currentStatus = statusMap[entityId]?.statusName;

    if (currentStatus === newStatus) {
      toast.info("Status is already up to date", { toastId: `status-uptodate-${entityId}` });
      return;
    }

    try {
      if (statusId) {
        await axios.put(`/updateStatus/${statusId}`, { statusName: newStatus });
      } else {
        await axios.post("/status", {
          entityId,
          entityType,
          role,
          statusName: newStatus,
        });
      }
      window.location.reload();
    } catch (err) {
      if (!toast.isActive(`updateError-${entityId}`)) {
        toast.error("Error updating status", { toastId: `updateError-${entityId}` });
      }
    }
  };

  return (
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
            <TableCell>Action</TableCell>
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
                    {row[col.key]}
                  </TableCell>
                ))}
                <TableCell>
                  <Select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(row._id, e.target.value, statusId)}
                    size="small"
                    className={`status-dropdown status-${currentStatus.toLowerCase().replace(/\s/g, "")}`}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === "Pending" && "🟠 Pending"}
                        {status === "In Progress" && "🟡 In Progress"}
                        {status === "Completed" && "🟢 Completed"}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Link to={typeof viewPath === "function" ? viewPath(row) : `${viewPath}/${row._id}`}>
                    <Button variant="contained" color="secondary" size="small">
                      <VisibilityIcon />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
