import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DownloadProgress } from '../components/DownloadProgress';
import { useDownloads } from '../hooks/useDownloads';

export const Home: React.FC = () => {
  const [selectedMangaUrl, setSelectedMangaUrl] = useState('');
  const {
    downloads,
    mangaList,
    error,
    isLoading,
    handleFetchMangaList,
    handleDownloadManga,
  } = useDownloads();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manga Downloader
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Button
                variant="contained"
                onClick={handleFetchMangaList}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Fetch Manga List'}
              </Button>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Select Manga</InputLabel>
                <Select
                  value={selectedMangaUrl}
                  label="Select Manga"
                  onChange={(e) => setSelectedMangaUrl(e.target.value)}
                  disabled={isLoading || mangaList.length === 0}
                >
                  {mangaList.map((manga) => (
                    <MenuItem key={manga.url} value={manga.url}>
                    {manga.title}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => handleDownloadManga(selectedMangaUrl)}
                disabled={!selectedMangaUrl || isLoading}
              >
                Download Manga
              </Button>
            </Box>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <DownloadProgress downloads={downloads} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}; 