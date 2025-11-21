import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Circle,
} from '@mui/icons-material';
import { SystemHealth } from '../../types';

interface SystemHealthCardProps {
  health: SystemHealth;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'unhealthy':
      return 'error';
    case 'degraded':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle />;
    case 'unhealthy':
      return <Error />;
    case 'degraded':
      return <Warning />;
    default:
      return <Circle />;
  }
};

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  health,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="System Health" />
        <CardContent>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Checking system status...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const healthyServices = Object.values(health.services).filter(
    (status) => status === 'healthy'
  ).length;
  const totalServices = Object.keys(health.services).length;
  const healthPercentage = (healthyServices / totalServices) * 100;

  return (
    <Card>
      <CardHeader
        title="System Health"
        action={
          <Chip
            icon={getStatusIcon(health.status)}
            label={health.status.toUpperCase()}
            color={getStatusColor(health.status) as any}
            variant="outlined"
          />
        }
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Overall Health: {healthyServices}/{totalServices} services healthy
          </Typography>
          <LinearProgress
            variant="determinate"
            value={healthPercentage}
            sx={{ height: 8, borderRadius: 4 }}
            color={healthPercentage === 100 ? 'success' : healthPercentage >= 50 ? 'warning' : 'error'}
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Service Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(health.services).map(([service, status]) => (
            <Box
              key={service}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: 'grey.50',
              }}
            >
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {service} Service
              </Typography>
              <Chip
                icon={getStatusIcon(status)}
                label={status}
                size="small"
                color={getStatusColor(status) as any}
                variant="outlined"
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">
            Uptime: {health.uptime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last checked: {new Date(health.lastChecked).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};