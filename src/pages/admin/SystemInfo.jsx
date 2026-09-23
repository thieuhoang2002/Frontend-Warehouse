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
      <Typography variant="h5" fontWeight={700} color="#fff" mb={3}>
        Thống kê hệ thống
      </Typography>
      <Grid container spacing={2.5}>
        {STATS.map(({ key, label, icon: Icon, color }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <Card
              elevation={0}
              sx={{
                bgcolor: "#171722",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderLeft: `4px solid ${color}`,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
                <Box
                  sx={{
                    bgcolor: color + "20",
                    borderRadius: 2.5,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ color, fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="#fff" lineHeight={1.1}>
                    {info[key] ?? 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                    {label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

}
