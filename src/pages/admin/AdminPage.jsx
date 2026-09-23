import React, { useState } from "react";
import {
  Box, Divider, List, ListItemButton, ListItemIcon, ListItemText,
  Paper, Typography, ThemeProvider, createTheme, CssBaseline
} from "@mui/material";
import {
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Warehouse as WarehouseIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import UserManagement from "./UserManagement";
import WarehouseManagement from "./WarehouseManagement";
import SystemInfo from "./SystemInfo";
import AuthService from "../../api/auth-login";

const adminDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    background: {
      default: "#1e1e2c",
      paper: "#171722",
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

const TABS = [
  { id: "users",      label: "Quản lý nhân viên",   icon: PeopleIcon },
  { id: "warehouses", label: "Quản lý kho & kệ",    icon: WarehouseIcon },
  { id: "system",     label: "Thông tin hệ thống",   icon: BarChartIcon },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const currentUser = AuthService.getCurrentUser();

  return (
    <ThemeProvider theme={adminDarkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#1e1e2c",
          pt: "76px",
          pb: 6,
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: 260 },
            flexShrink: 0,
            borderRadius: 3,
            height: "fit-content",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            bgcolor: "#171722",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
              p: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <AdminIcon sx={{ color: "#fff", fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#fff" lineHeight={1.2}>
                Quản Trị Viên
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Hệ thống Quản lý Kho
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <List disablePadding sx={{ py: 1 }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const isSelected = activeTab === id;
              return (
                <ListItemButton
                  key={id}
                  selected={isSelected}
                  onClick={() => setActiveTab(id)}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                    color: isSelected ? "#60a5fa" : "#94a3b8",
                    bgcolor: isSelected ? "rgba(59, 130, 246, 0.15) !important" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? "#3b82f6" : "#64748b", minWidth: 40 }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: 14,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Paper>

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {activeTab === "users"      && <UserManagement currentUsername={currentUser?.username} />}
          {activeTab === "warehouses" && <WarehouseManagement />}
          {activeTab === "system"     && <SystemInfo />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}


