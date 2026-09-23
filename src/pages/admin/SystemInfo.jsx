import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Grid, Snackbar, Alert, Typography,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Warehouse as WarehouseIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  MoveToInbox as MoveToInboxIcon,
  CheckCircle as CheckCircleIcon,
  RestartAlt as RestartAltIcon,
  CleaningServices as CleaningServicesIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { getSystemInfo, resetDemoData } from "../../api/admin";

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
  const [info,            setInfo]            = useState({});
  const [loading,         setLoading]         = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting,       setResetting]       = useState(false);
  const [snackbar,        setSnackbar]        = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    getSystemInfo().then((data) => { setInfo(data); setLoading(false); });
  }, []);

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await resetDemoData();
      setSnackbar({ open: true, message: "Đã dọn dẹp R2 và khôi phục toàn bộ dữ liệu demo về trạng thái ban đầu!", severity: "success" });
      setResetDialogOpen(false);
      const newInfo = await getSystemInfo();
      setInfo(newInfo);
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi khi khôi phục dữ liệu demo: " + (err.response?.data?.message || err.message), severity: "error" });
    } finally {
      setResetting(false);
    }
  };

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

      {/* ── Demo Data Management Card ────────────────────────────────────── */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
          Quản trị dữ liệu Demo
        </Typography>
        <Card
          elevation={0}
          sx={{
            bgcolor: "#171722",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 3 }}>
            <Box sx={{ maxWidth: 700 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <ScheduleIcon sx={{ color: "#38bdf8" }} />
                <Typography variant="subtitle1" fontWeight={700} color="#fff">
                  Cơ chế tự động dọn rác & khôi phục sau 24h
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
                Hệ thống được thiết lập lịch tự động chạy vào lúc <strong>02:00 sáng mỗi ngày</strong>: dọn sạch các file CSV upload thử nghiệm trên Cloudflare R2, xóa bỏ các booking/hàng hóa rác, và khôi phục database về 3 tài khoản mặc định cùng kho hàng mẫu ban đầu.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="warning"
              startIcon={<RestartAltIcon />}
              onClick={() => setResetDialogOpen(true)}
              sx={{
                bgcolor: "#ea580c",
                "&:hover": { bgcolor: "#c2410c" },
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              Khôi phục dữ liệu Demo
            </Button>
          </Box>
        </Card>
      </Box>

      {/* ── Confirm Dialog ────────────────────────────────────────────────── */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => !resetting && setResetDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e2d",
            color: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            p: 1,
            maxWidth: 480,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#f97316", fontWeight: 700 }}>
          <CleaningServicesIcon /> Xác nhận khôi phục Demo
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#cbd5e1", mb: 2, lineHeight: 1.6 }}>
            Thao tác này sẽ thực hiện các bước sau:
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, m: 0, color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.8 }}>
            <li>Xóa toàn bộ file CSV upload thử nghiệm trên Cloudflare R2.</li>
            <li>Xóa các đơn booking, hàng hóa, và lịch sử xuất kho phát sinh.</li>
            <li>Nạp lại 3 tài khoản mặc định (<code>admin</code>, <code>nguyen.van.a</code>, <code>tran.thi.b</code>).</li>
            <li>Khôi phục 2 kho hàng mẫu, 6 dãy kệ 3D và các ngăn kệ ban đầu.</li>
          </Box>
          <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#f87171" }}>
            ⚠️ Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?
          </Typography>
        </DialogContent>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setResetDialogOpen(false)}
            disabled={resetting}
            sx={{ color: "#94a3b8" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleResetDemo}
            disabled={resetting}
            startIcon={resetting ? <CircularProgress size={18} color="inherit" /> : <RestartAltIcon />}
            sx={{
              bgcolor: "#ea580c",
              "&:hover": { bgcolor: "#c2410c" },
              fontWeight: 700,
            }}
          >
            {resetting ? "Đang khôi phục..." : "Xác nhận khôi phục"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ──────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
