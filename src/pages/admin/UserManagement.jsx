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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Danh sách tài khoản ({users.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Thêm tài khoản
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              {["STT", "Tên đăng nhập", "Họ tên", "Email", "Vai trò", "Thao tác"].map((h) => (
                <TableCell key={h} sx={{ color: "#fff", fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u, i) => (
              <TableRow key={u.userId} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {u.username}
                    {u.username === currentUsername && (
                      <Chip label="Bạn" size="small" color="warning" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{u.profileName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={ROLE_LABEL[u.role] || u.role} color={ROLE_COLOR[u.role] || "default"} size="small" />
                </TableCell>
                <TableCell>
                  <Tooltip title="Sửa thông tin"><IconButton color="primary" onClick={() => openEdit(u)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Đặt lại mật khẩu"><IconButton color="warning" onClick={() => openReset(u)}><LockResetIcon /></IconButton></Tooltip>
                  <Tooltip title="Xóa">
                    <span>
                      <IconButton color="error" onClick={() => openDelete(u)} disabled={u.username === currentUsername}>
                        <DeleteIcon />
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
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm tài khoản mới</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
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
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>Tạo</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Sửa thông tin ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa thông tin — {selectedUser?.username}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
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
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleEdit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Đặt lại mật khẩu ── */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Đặt lại mật khẩu — {selectedUser?.username}</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <TextField label="Mật khẩu mới (tối thiểu 6 ký tự)" type="password" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Hủy</Button>
          <Button variant="contained" color="warning" onClick={handleReset}>Đặt lại</Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Xóa ── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn chắc chắn muốn xóa tài khoản <strong>{selectedUser?.username}</strong>?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
