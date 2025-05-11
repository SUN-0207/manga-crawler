import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { QueueItem } from '../types';

interface DownloadQueueProps {
  queue: QueueItem[];
  onRemove: (mangaUrl: string) => void;
  onPause: (mangaUrl: string) => void;
  onResume: (mangaUrl: string) => void;
}

export const DownloadQueue: React.FC<DownloadQueueProps> = ({
  queue,
  onRemove,
  onPause,
  onResume,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Download Queue
        </Typography>
        <List>
          {queue.map((item) => (
            <ListItem key={item.mangaUrl}>
              <ListItemText
                primary={item.mangaTitle}
                secondary={
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.chapters.filter((ch) => ch.status === 'completed').length} /{' '}
                      {item.chapters.length} chapters completed
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {item.status === 'downloading' ? (
                  <IconButton
                    edge="end"
                    aria-label="pause"
                    onClick={() => onPause(item.mangaUrl)}
                  >
                    <PauseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="end"
                    aria-label="resume"
                    onClick={() => onResume(item.mangaUrl)}
                  >
                    <PlayIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemove(item.mangaUrl)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}; 