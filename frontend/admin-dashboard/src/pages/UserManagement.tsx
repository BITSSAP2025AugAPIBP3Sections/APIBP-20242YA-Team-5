import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Download,
  FilterList,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { adminService } from '../services';
import { User, PaginatedResponse } from '../types';
import { format } from 'date-fns';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getUsers(page, 20, searchTerm, roleFilter);
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page, searchTerm, roleFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleRoleFilterChange = (e: any) => {
    const value = e.target.value;
    setRoleFilter(value);
    setPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  const handleCloseEdit = () => {
    setEditUser(null);
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      setUpdating(true);
      await adminService.updateUser(editUser.id, {
        fullName: editUser.fullName,
        email: editUser.email,
        role: editUser.role,
        isVerified: editUser.isVerified,
      });
      // Reload users to reflect changes
      const data = await adminService.getUsers(page, 20, searchTerm, roleFilter);
      setUsers(data);
      setEditUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminService.deleteUser(userId);
      // Reload users to reflect changes
      const data = await adminService.getUsers(page, 20, searchTerm, roleFilter);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleVerifyUser = async (userId: string, currentlyVerified: boolean) => {
    const action = currentlyVerified ? 'unverify' : 'verify';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      if (currentlyVerified) {
        // Unverify by updating the user
        await adminService.updateUser(userId, { isVerified: false });
      } else {
        // Verify using the dedicated endpoint
        await adminService.verifyUser(userId);
      }
      // Reload users to reflect changes
      const data = await adminService.getUsers(page, 20, searchTerm, roleFilter);
      setUsers(data);
      setSuccessMessage(`User ${action}ed successfully`);
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to ${action} user`);
      setSuccessMessage(null);
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await adminService.exportUsers('csv');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export users');
    }
  };

  // Since we're doing filtering on the backend, we don't need to filter here
  const displayUsers = users?.content || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'UNIVERSITY': return 'primary';
      case 'STUDENT': return 'info';
      case 'EMPLOYER': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportUsers}
          sx={{ ml: 2 }}
        >
          Export Users
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={handleRoleFilterChange}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="UNIVERSITY">University</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="EMPLOYER">Employer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : displayUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isVerified ? 'Verified' : 'Unverified'}
                          color={user.isVerified ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit user">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isVerified ? 'Mark as unverified' : 'Mark as verified'}>
                          <IconButton
                            size="small"
                            onClick={() => handleVerifyUser(user.id, user.isVerified)}
                            color={user.isVerified ? 'warning' : 'success'}
                          >
                            {user.isVerified ? <Cancel /> : <CheckCircle />}
                          </IconButton>
                        </Tooltip>
                        {user.role !== 'ADMIN' && (
                          <Tooltip title="Delete user">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUser(user.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {users && users.totalPages && users.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={users.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Full Name"
                value={editUser.fullName}
                onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                fullWidth
                type="email"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editUser.role}
                  label="Role"
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="university">University</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Verified Status</InputLabel>
                <Select
                  value={editUser.isVerified ? 'verified' : 'unverified'}
                  label="Verified Status"
                  onChange={(e) => setEditUser({ ...editUser, isVerified: e.target.value === 'verified' })}
                >
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="unverified">Unverified</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};