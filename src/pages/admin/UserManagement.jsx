import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel,
  MenuItem, Paper, Select, Snackbar, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
} from "@mui/icons-material";
import {
  getAllUsers, createUser, updateUser, resetPassword, deleteUser,
} from "../../api/admin";

const ROLE_LABEL = { ROLE_ADMIN: "Admin", ROLE_STAFF: "Nhân viên" };
const ROLE_COLOR = { ROLE_ADMIN: "error", ROLE_STAFF: "primary" };

const EMPTY_CREATE = { username: "", password: "", profileName: "", email: "", role: "ROLE_STAFF" };
const EMPTY_EDIT   = { profileName: "", email: "", role: "ROLE_STAFF" };

export default function UserManagement({ currentUsername }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [createOpen,        setCreateOpen]        = useState(false);
  const [editOpen,          setEditOpen]          = useState(false);
  const [resetOpen,         setResetOpen]         = useState(false);
  const [deleteOpen,        setDeleteOpen]        = useState(false);
  const [selectedUser,      setSelectedUser]      = useState(null);

  // form state
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [editForm,   setEditForm]   = useState(EMPTY_EDIT);
  const [newPassword,setNewPassword]= useState("");

  // snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const load = useCallback(() => {
    setLoading(true);
    getAllUsers().then((data) => { setUsers(data); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    try {
      await createUser(createForm);
      showSnack("Tạo tài khoản thành công!");
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
      load();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi tạo tài khoản", "error");
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ profileName: user.profileName, email: user.email, role: user.role });
    setEditOpen(true);
  };
  const handleEdit = async () => {
    try {
      await updateUser(selectedUser.userId, editForm);
      showSnack("Cập nhật thành công!");
      setEditOpen(false);
      load();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi cập nhật", "error");
    }
  };

  // ── Reset Password ────────────────────────────────────────────────────────
  const openReset = (user) => { setSelectedUser(user); setNewPassword(""); setResetOpen(true); };
  const handleReset = async () => {
    try {
      await resetPassword(selectedUser.userId, newPassword);
      showSnack("Đặt lại mật khẩu thành công!");
      setResetOpen(false);
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi đặt lại mật khẩu", "error");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const openDelete = (user) => { setSelectedUser(user); setDeleteOpen(true); };
  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.userId);
      showSnack("Xóa tài khoản thành công!");
      setDeleteOpen(false);
      load();
    } catch (e) {
      showSnack(e.response?.data?.message || "Lỗi khi xóa tài khoản", "error");
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#fff">
          Danh sách tài khoản ({users.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
          }}
        >
          Thêm tài khoản
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
              {["STT", "Tên đăng nhập", "Họ tên", "Email", "Vai trò", "Thao tác"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    py: 1.8,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u, i) => (
              <TableRow
                key={u.userId}
                hover
                sx={{
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.03) !important" },
                }}
              >
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#94a3b8" }}>
                  {i + 1}
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#fff", fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {u.username}
                    {u.username === currentUsername && (
                      <Chip label="Bạn" size="small" color="warning" sx={{ height: 20, fontSize: 11 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#cbd5e1" }}>
                  {u.profileName}
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#94a3b8" }}>
                  {u.email}
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
                  <Chip
                    label={ROLE_LABEL[u.role] || u.role}
                    color={ROLE_COLOR[u.role] || "default"}
                    size="small"
                    variant={u.role === "ROLE_ADMIN" ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
                  <Tooltip title="Sửa thông tin">
                    <IconButton color="primary" onClick={() => openEdit(u)} size="small" sx={{ mr: 0.5 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Đặt lại mật khẩu">
                    <IconButton color="warning" onClick={() => openReset(u)} size="small" sx={{ mr: 0.5 }}>
                      <LockResetIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => openDelete(u)}
                        disabled={u.username === currentUsername}
                        size="small"
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

      {/* ── Dialog: Tạo tài khoản ── */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Thêm tài khoản mới</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField label="Tên đăng nhập *" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} fullWidth />
          <TextField label="Mật khẩu *" type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} fullWidth />
          <TextField label="Họ tên *" value={createForm.profileName} onChange={(e) => setCreateForm({ ...createForm, profileName: e.target.value })} fullWidth />
          <TextField label="Email *" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select value={createForm.role} label="Vai trò" onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
              <MenuItem value="ROLE_STAFF">Nhân viên</MenuItem>
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate} sx={{ px: 3 }}>Tạo</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Sửa thông tin ── */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Sửa thông tin — {selectedUser?.username}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField label="Họ tên" value={editForm.profileName} onChange={(e) => setEditForm({ ...editForm, profileName: e.target.value })} fullWidth />
          <TextField label="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select value={editForm.role} label="Vai trò" onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <MenuItem value="ROLE_STAFF">Nhân viên</MenuItem>
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" onClick={handleEdit} sx={{ px: 3 }}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Đặt lại mật khẩu ── */}
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Đặt lại mật khẩu — {selectedUser?.username}</DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          <TextField
            label="Mật khẩu mới (tối thiểu 6 ký tự)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setResetOpen(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" color="warning" onClick={handleReset} sx={{ px: 3 }}>Đặt lại</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Xóa ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{
          sx: { bgcolor: "#171722", color: "#fff", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography color="#cbd5e1">
            Bạn chắc chắn muốn xóa tài khoản <strong>{selectedUser?.username}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ color: "#94a3b8" }}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ px: 3 }}>Xóa</Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
