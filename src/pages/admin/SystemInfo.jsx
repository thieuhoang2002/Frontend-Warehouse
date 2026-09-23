import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, CircularProgress, Grid, Typography,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Warehouse as WarehouseIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  MoveToInbox as MoveToInboxIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { getSystemInfo } from "../../api/admin";

const STATS = [
  { key: "totalUsers",        label: "Tài khoản",       icon: PeopleIcon,       color: "#3f51b5" },
  { key: "totalBookings",     label: "Booking",          icon: AssignmentIcon,   color: "#9c27b0" },
  { key: "totalItems",        label: "Sản phẩm",         icon: InventoryIcon,    color: "#f57c00" },
  { key: "totalWarehouses",   label: "Kho hàng",         icon: WarehouseIcon,    color: "#388e3c" },
  { key: "totalShelves",      label: "Kệ hàng",          icon: CategoryIcon,     color: "#00796b" },
  { key: "totalCompartments", label: "Ngăn",             icon: MoveToInboxIcon,  color: "#0288d1" },
  { key: "totalCheckouts",    label: "Lịch sử xuất kho", icon: CheckCircleIcon,  color: "#d32f2f" },
];

export default function SystemInfo() {
  const [info,    setInfo]    = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemInfo().then((data) => { setInfo(data); setLoading(false); });
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={3}>Thống kê hệ thống</Typography>
      <Grid container spacing={3}>
        {STATS.map(({ key, label, icon: Icon, color }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <Card elevation={3} sx={{ borderRadius: 3, borderLeft: `5px solid ${color}` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: color + "22", borderRadius: 2, p: 1.5, display: "flex" }}>
                  <Icon sx={{ color, fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} color={color}>
                    {info[key] ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
