import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel,
  MenuItem, Paper, Select, Snackbar, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip,
  Typography, Tabs, Tab, Grid, Card, CardContent
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  Category as CategoryIcon,
  Place as PlaceIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import {
  getAllWarehouses, createWarehouse, updateWarehouse, deleteWarehouse,
  getAllShelves, createShelf, deleteShelf
} from "../../api/admin";

export default function WarehouseManagement() {
  const [subTab, setSubTab] = useState(0); // 0: Kho hàng, 1: Kệ hàng
  const [warehouses, setWarehouses] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Warehouse Dialogs
  const [openCreateWh, setOpenCreateWh] = useState(false);
  const [openEditWh, setOpenEditWh] = useState(false);
  const [openDeleteWh, setOpenDeleteWh] = useState(false);
  const [selectedWh, setSelectedWh] = useState(null);
  const [whForm, setWhForm] = useState({ name: "", location: "" });

  // Shelf Dialogs
  const [openCreateShelf, setOpenCreateShelf] = useState(false);
  const [openDeleteShelf, setOpenDeleteShelf] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [shelfForm, setShelfForm] = useState({
    nameShelf: "",
    type: "Electronics",
    warehouseId: "",
    xCoord: 5,
    yCoord: 0,
    zCoord: 1,
    layers: 2,
    compartmentsPerLayer: 3,
  });

  // Snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [whData, shelfData] = await Promise.all([
        getAllWarehouses(),
        getAllShelves(),
      ]);
      setWarehouses(whData);
      setShelves(shelfData);
      if (whData.length > 0 && !shelfForm.warehouseId) {
        setShelfForm((prev) => ({ ...prev, warehouseId: whData[0].warehouseId }));
      }
    } catch {
      showSnack("Lỗi tải dữ liệu kho & kệ", "error");
    } finally {
      setLoading(false);
    }
  }, [shelfForm.warehouseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Warehouse Handlers ───────────────────────────────────────────────────
  const handleCreateWarehouse = async () => {
    if (!whForm.name.trim()) {
      showSnack("Vui lòng nhập tên kho", "warning");
      return;
    }
    try {
      await createWarehouse(whForm);
      showSnack("Tạo kho hàng thành công!");
      setOpenCreateWh(false);
      setWhForm({ name: "", location: "" });
      loadData();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi tạo kho", "error");
    }
  };

  const handleEditWarehouse = async () => {
    try {
      await updateWarehouse(selectedWh.warehouseId, whForm);
      showSnack("Cập nhật kho hàng thành công!");
      setOpenEditWh(false);
      loadData();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi cập nhật kho", "error");
    }
  };

  const handleDeleteWarehouse = async () => {
    try {
      await deleteWarehouse(selectedWh.warehouseId);
      showSnack("Xóa kho hàng thành công!");
      setOpenDeleteWh(false);
      loadData();
    } catch (e) {
      showSnack(e.response?.data?.message || "Không thể xóa kho", "error");
    }
  };

  // ── Shelf Handlers ───────────────────────────────────────────────────────
  const handleCreateShelf = async () => {
    if (!shelfForm.nameShelf.trim()) {
      showSnack("Vui lòng nhập tên kệ", "warning");
      return;
    }
    if (!shelfForm.warehouseId) {
      showSnack("Vui lòng chọn kho trực thuộc", "warning");
      return;
    }
    try {
      await createShelf(shelfForm);
      showSnack("Tạo kệ hàng và các ngăn thành công!");
      setOpenCreateShelf(false);
      setShelfForm({
        nameShelf: "",
        type: "Electronics",
        warehouseId: warehouses[0]?.warehouseId || "",
        xCoord: 5,
        yCoord: 0,
        zCoord: 1,
        layers: 2,
        compartmentsPerLayer: 3,
      });
      loadData();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi tạo kệ", "error");
    }
  };

  const handleDeleteShelf = async () => {
    try {
      await deleteShelf(selectedShelf.shelfId);
      showSnack("Xóa kệ hàng thành công!");
      setOpenDeleteShelf(false);
      loadData();
    } catch (e) {
      showSnack(e.response?.data?.message || "Không thể xóa kệ", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="#fff">
          Quản lý Kho & Kệ Hàng
        </Typography>
        <Tabs
          value={subTab}
          onChange={(e, val) => setSubTab(val)}
          sx={{
            bgcolor: "#171722",
            borderRadius: 2,
            p: 0.5,
            border: "1px solid rgba(255,255,255,0.08)",
            "& .MuiTab-root": {
              color: "#94a3b8",
              textTransform: "none",
              fontWeight: 600,
              minHeight: 38,
              borderRadius: 1.5,
              px: 2,
            },
            "& .Mui-selected": {
              color: "#fff !important",
              bgcolor: "primary.main",
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab icon={<WarehouseIcon fontSize="small" sx={{ mr: 0.5 }} />} iconPosition="start" label="Kho hàng" />
          <Tab icon={<CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />} iconPosition="start" label="Kệ hàng" />
        </Tabs>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SUB-TAB 0: QUẢN LÝ KHO HÀNG */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setWhForm({ name: "", location: "" });
                setOpenCreateWh(true);
              }}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Thêm Kho Mới
            </Button>
          </Box>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {warehouses.map((w) => (
              <Grid item xs={12} md={6} key={w.warehouseId}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: "#171722",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    p: 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 1.2, bgcolor: "rgba(59, 130, 246, 0.15)", borderRadius: 2, color: "#3b82f6" }}>
                          <WarehouseIcon fontSize="medium" />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={700} color="#fff">
                            {w.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8", mt: 0.3 }}>
                            <PlaceIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">{w.location || "Chưa cập nhật địa chỉ"}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Tooltip title="Sửa kho">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              setSelectedWh(w);
                              setWhForm({ name: w.name, location: w.location });
                              setOpenEditWh(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa kho">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedWh(w);
                              setOpenDeleteWh(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography variant="h5" fontWeight={700} color="#60a5fa">
                          {w.shelfCount}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">Kệ hàng</Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography variant="h5" fontWeight={700} color="#34d399">
                          {w.compartmentCount}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">Tổng số ngăn</Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography variant="h5" fontWeight={700} color="#fbbf24">
                          {w.itemCount}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">Ngăn có hàng</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SUB-TAB 1: QUẢN LÝ KỆ HÀNG */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateShelf(true)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Thêm Kệ Mới
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: "#171722",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#24273c" }}>
                <TableRow>
                  {["STT", "Tên kệ", "Kho trực thuộc", "Loại hàng", "Tọa độ 3D (X, Y, Z)", "Số ngăn", "Trạng thái", "Thao tác"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, borderColor: "rgba(255,255,255,0.08)", py: 1.8 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {shelves.map((s, i) => (
                  <TableRow key={s.shelfId} hover sx={{ "&:hover": { bgcolor: "rgba(255, 255, 255, 0.03) !important" } }}>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>{i + 1}</TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 600 }}>
                      {s.nameShelf}
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)", color: "#cbd5e1" }}>
                      {s.warehouseName}
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <Chip label={s.type} size="small" sx={{ bgcolor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }} />
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)", color: "#94a3b8", fontFamily: "monospace" }}>
                      ({s.xCoord}, {s.yCoord}, {s.zCoord})
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)", color: "#34d399", fontWeight: 600 }}>
                      {s.compartmentCount} ngăn
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      {s.hasItems ? (
                        <Chip icon={<WarningIcon />} label="Đang chứa hàng" size="small" color="warning" />
                      ) : (
                        <Chip icon={<CheckCircleIcon />} label="Trống" size="small" color="success" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <Tooltip title={s.hasItems ? "Không thể xóa kệ đang có hàng" : "Xóa kệ"}>
                        <span>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedShelf(s);
                              setOpenDeleteShelf(true);
                            }}
                            disabled={s.hasItems}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ── Dialog: Tạo Kho Mới ── */}
      <Dialog
        open={openCreateWh}
        onClose={() => setOpenCreateWh(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Thêm Kho Hàng Mới</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField
            label="Tên kho hàng *"
            value={whForm.name}
            onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
            placeholder="Ví dụ: Kho C - Đồ gia dụng"
            fullWidth
          />
          <TextField
            label="Địa chỉ / Vị trí *"
            value={whForm.location}
            onChange={(e) => setWhForm({ ...whForm, location: e.target.value })}
            placeholder="Ví dụ: Tầng 3, Tòa nhà B, KCN Tân Bình"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCreateWh(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateWarehouse}>Tạo kho</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Sửa Kho ── */}
      <Dialog
        open={openEditWh}
        onClose={() => setOpenEditWh(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh Sửa Kho Hàng</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField
            label="Tên kho hàng *"
            value={whForm.name}
            onChange={(e) => setWhForm({ ...whForm, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Địa chỉ / Vị trí *"
            value={whForm.location}
            onChange={(e) => setWhForm({ ...whForm, location: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenEditWh(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" onClick={handleEditWarehouse}>Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Xóa Kho ── */}
      <Dialog
        open={openDeleteWh}
        onClose={() => setOpenDeleteWh(false)}
        PaperProps={{ sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa kho</DialogTitle>
        <DialogContent>
          <Typography color="#cbd5e1">
            Bạn có chắc chắn muốn xóa kho <strong>{selectedWh?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            Lưu ý: Chỉ có thể xóa kho khi tất cả các kệ trong kho không còn chứa hàng hóa.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDeleteWh(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteWarehouse}>Xóa kho</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Tạo Kệ Mới ── */}
      <Dialog
        open={openCreateShelf}
        onClose={() => setOpenCreateShelf(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Thêm Kệ Hàng Mới</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField
            label="Tên kệ *"
            value={shelfForm.nameShelf}
            onChange={(e) => setShelfForm({ ...shelfForm, nameShelf: e.target.value })}
            placeholder="Ví dụ: Kệ A5"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Kho trực thuộc *</InputLabel>
            <Select
              value={shelfForm.warehouseId}
              label="Kho trực thuộc *"
              onChange={(e) => setShelfForm({ ...shelfForm, warehouseId: e.target.value })}
            >
              {warehouses.map((w) => (
                <MenuItem key={w.warehouseId} value={w.warehouseId}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Loại hàng hóa</InputLabel>
            <Select
              value={shelfForm.type}
              label="Loại hàng hóa"
              onChange={(e) => setShelfForm({ ...shelfForm, type: e.target.value })}
            >
              <MenuItem value="Electronics">Điện tử (Electronics)</MenuItem>
              <MenuItem value="Clothing">Thời trang (Clothing)</MenuItem>
              <MenuItem value="Food">Thực phẩm (Food)</MenuItem>
              <MenuItem value="General">Hàng tổng hợp (General)</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mt: 1 }}>
            Tọa độ hiển thị 3D:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Tọa độ X (hàng)"
                type="number"
                value={shelfForm.xCoord}
                onChange={(e) => setShelfForm({ ...shelfForm, xCoord: parseFloat(e.target.value) || 0 })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Tọa độ Y (độ cao)"
                type="number"
                value={shelfForm.yCoord}
                onChange={(e) => setShelfForm({ ...shelfForm, yCoord: parseFloat(e.target.value) || 0 })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Tọa độ Z (cột)"
                type="number"
                value={shelfForm.zCoord}
                onChange={(e) => setShelfForm({ ...shelfForm, zCoord: parseFloat(e.target.value) || 0 })}
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mt: 1 }}>
            Cấu hình ngăn tự động tạo:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Số tầng kệ (Layers)"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={shelfForm.layers}
                onChange={(e) => setShelfForm({ ...shelfForm, layers: parseInt(e.target.value, 10) || 1 })}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Số ngăn mỗi tầng"
                type="number"
                inputProps={{ min: 1, max: 4 }}
                value={shelfForm.compartmentsPerLayer}
                onChange={(e) => setShelfForm({ ...shelfForm, compartmentsPerLayer: parseInt(e.target.value, 10) || 1 })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCreateShelf(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateShelf}>Tạo kệ hàng</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Xóa Kệ ── */}
      <Dialog
        open={openDeleteShelf}
        onClose={() => setOpenDeleteShelf(false)}
        PaperProps={{ sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa kệ</DialogTitle>
        <DialogContent>
          <Typography color="#cbd5e1">
            Bạn có chắc chắn muốn xóa <strong>{selectedShelf?.nameShelf}</strong>?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            Tất cả các ngăn trống thuộc kệ này cũng sẽ được xóa khỏi hệ thống.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDeleteShelf(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteShelf}>Xóa kệ</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
