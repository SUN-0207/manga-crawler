import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { DownloadStatus } from '../types';

interface DownloadProgressProps {
  downloads: DownloadStatus[];
}

const getStatusColor = (status: DownloadStatus['status']): 'success' | 'error' | 'primary' | 'info' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'error':
      return 'error';
    case 'downloading':
      return 'primary';
    default:
      return 'info';
  }
};

export const DownloadProgress: React.FC<DownloadProgressProps> = ({ downloads }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Download Progress
        </Typography>
        <List>
          {downloads.map((download, index) => (
            <ListItem key={`${download.mangaTitle}-${download.chapterName}-${index}`}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">{download.mangaTitle}</Typography>
                    <Chip
                      label={download.status}
                      size="small"
                      color={getStatusColor(download.status)}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {download.chapterName}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={download.progress}
                      color={getStatusColor(download.status)}
                    />
                    {download.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        Error: {download.error}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}; 