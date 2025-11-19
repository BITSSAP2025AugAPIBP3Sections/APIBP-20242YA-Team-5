import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import { MonthlyData, UserRoleData } from '../../types';

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: MonthlyData[] | UserRoleData[];
  loading?: boolean;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  loading = false,
  height = 300,
}) => {
  const renderChart = () => {
    if (loading || !data.length) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height,
            color: 'text.secondary',
          }}
        >
          {loading ? 'Loading...' : 'No data available'}
        </Box>
      );
    }

    // Simple visualization for now - can be enhanced with chart library later
    if (type === 'pie' && 'role' in data[0]) {
      return (
        <Box sx={{ p: 2 }}>
          {(data as UserRoleData[]).map((item, index) => (
            <Box key={item.role} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {item.role}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {item.count} ({item.percentage}%)
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    if (type === 'line' || type === 'bar') {
      const monthlyData = data as MonthlyData[];
      const maxValue = Math.max(...monthlyData.flatMap(d => [d.certificates, d.verifications]));
      
      return (
        <Box sx={{ p: 2 }}>
          {monthlyData.map((item, index) => (
            <Box key={item.month} sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                {item.month}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Certificates</Typography>
                  <Typography variant="caption">{item.certificates}</Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    bgcolor: 'grey.200',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(item.certificates / maxValue) * 100}%`,
                      height: '100%',
                      bgcolor: 'primary.main',
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Verifications</Typography>
                  <Typography variant="caption">{item.verifications}</Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    bgcolor: 'grey.200',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(item.verifications / maxValue) * 100}%`,
                      height: '100%',
                      bgcolor: 'secondary.main',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} />
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};