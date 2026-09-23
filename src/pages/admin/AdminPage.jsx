import React, { useState } from "react";
import {
  Box, Divider, List, ListItemButton, ListItemIcon, ListItemText,
  Paper, Typography,
} from "@mui/material";
import {
  People as PeopleIcon,
  BarChart as BarChartIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import UserManagement from "./UserManagement";
import SystemInfo from "./SystemInfo";
import AuthService from "../../api/auth-login";

const TABS = [
  { id: "users",   label: "Quản lý nhân viên",   icon: PeopleIcon },
  { id: "system",  label: "Thông tin hệ thống",   icon: BarChartIcon },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const currentUser = AuthService.getCurrentUser();

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 130px)", mt: "70px", px: 2, pb: 4 }}>
      {/* Sidebar */}
      <Paper elevation={3} sx={{ width: 240, mr: 3, borderRadius: 3, height: "fit-content", overflow: "hidden" }}>
        <Box sx={{ bgcolor: "primary.main", p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AdminIcon sx={{ color: "#fff" }} />
          <Typography variant="subtitle1" fontWeight={700} color="#fff">
            Quản Trị Viên
          </Typography>
        </Box>
        <Divider />
        <List disablePadding>
          {TABS.map(({ id, label, icon: Icon }) => (
            <ListItemButton
              key={id}
              selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              sx={{
                "&.Mui-selected": { bgcolor: "primary.light", color: "primary.contrastText" },
                "&.Mui-selected .MuiListItemIcon-root": { color: "primary.main" },
              }}
            >
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {activeTab === "users"  && <UserManagement currentUsername={currentUser?.username} />}
        {activeTab === "system" && <SystemInfo />}
      </Box>
    </Box>
  );
}
