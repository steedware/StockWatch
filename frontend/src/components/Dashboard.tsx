import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  LinearProgress,
  Paper,
  Avatar,
  IconButton,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
  Timeline,
  AttachMoney,
  ShowChart,
} from '@mui/icons-material';
import { WatchedStock, WatchedStockRequest } from '../types';
import { watchlistService } from '../services/api';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [watchedStocks, setWatchedStocks] = useState<WatchedStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<WatchedStock | null>(null);
  const [stockForm, setStockForm] = useState<WatchedStockRequest>({
    symbol: '',
    minPrice: undefined,
    maxPrice: undefined
  });

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const stocks = await watchlistService.getWatchlist();
      setWatchedStocks(stocks);
    } catch (err) {
      setError('Error loading watchlist');
      setWatchedStocks([]); // Ustawienie pustej listy przy błędzie
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    setEditingStock(null);
    setStockForm({ symbol: '', minPrice: undefined, maxPrice: undefined });
    setDialogOpen(true);
  };

  const handleEditStock = (stock: WatchedStock) => {
    setEditingStock(stock);
    setStockForm({
      symbol: stock.symbol,
      minPrice: stock.minPrice,
      maxPrice: stock.maxPrice
    });
    setDialogOpen(true);
  };

  const handleSaveStock = async () => {
    try {
      if (editingStock) {
        await watchlistService.updateStock(editingStock.id, stockForm);
      } else {
        await watchlistService.addStock(stockForm);
      }
      setDialogOpen(false);
      loadWatchlist();
    } catch (err) {
      setError('Error saving stock');
    }
  };

  const handleDeleteStock = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this stock from watchlist?')) {
      try {
        await watchlistService.removeStock(id);
        loadWatchlist();
      } catch (err) {
        setError('Error removing stock');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Loading your stocks...
          </Typography>
          <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
          💼 Your Portfolio
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Manage your watched stocks
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddStock}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(45deg, #00d4aa, #01a3ff)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00c49a, #0192e6)',
              }
            }}
          >
            Add Stock
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      ) : null}

      {watchedStocks.length === 0 ? (
        <Paper sx={{
          textAlign: 'center',
          py: 12,
          background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(255, 64, 129, 0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Box sx={{ mb: 4 }}>
            <ShowChart sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Start your investment journey
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Add your first stock to watch and track its prices in real time
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddStock}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #00d4aa, #01a3ff)',
              }}
            >
              Add first stock
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          {/* Portfolio Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(0, 212, 170, 0.05) 100%)',
                border: '1px solid rgba(0, 212, 170, 0.3)',
              }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {watchedStocks.length}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Watched Stocks
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255, 64, 129, 0.2) 0%, rgba(255, 64, 129, 0.05) 100%)',
                border: '1px solid rgba(255, 64, 129, 0.3)',
              }}>
                <Typography variant="h3" fontWeight="bold" color="secondary">
                  {watchedStocks.filter(s => s.active).length}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Active Alerts
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.05) 100%)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
              }}>
                <Typography variant="h3" fontWeight="bold" color="info">
                  24/7
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Monitoring
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Stocks Grid */}
          <Grid container spacing={3}>
            {watchedStocks.map((stock, index) => (
              <Grid item xs={12} sm={6} lg={4} key={stock.id}>
                <Fade in={true} timeout={300 * (index + 1)}>
                  <Card sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(255,255,255,0.02) 100%)`,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px rgba(0, 212, 170, 0.15)`,
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{
                            width: 50,
                            height: 50,
                            background: 'linear-gradient(45deg, #00d4aa, #ff4081)',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}>
                            {stock.symbol.substring(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography variant="h5" fontWeight="bold">
                              {stock.symbol}
                            </Typography>
                            <Chip
                              label={stock.active ? 'Active' : 'Inactive'}
                              color={stock.active ? 'success' : 'default'}
                              size="small"
                              sx={{ borderRadius: 2 }}
                            />
                          </Box>
                        </Box>
                        <Timeline color="primary" />
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        {stock.minPrice ? (
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                          }}>
                            <TrendingDown color="error" sx={{ mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Alert on drop below
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="error">
                                ${stock.minPrice}
                              </Typography>
                            </Box>
                          </Box>
                        ) : null}
                        {stock.maxPrice ? (
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                          }}>
                            <TrendingUp color="success" sx={{ mr: 2 }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Alert on rise above
                              </Typography>
                              <Typography variant="h6" fontWeight="bold" color="success">
                                ${stock.maxPrice}
                              </Typography>
                            </Box>
                          </Box>
                        ) : null}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Added: {new Date(stock.createdAt).toLocaleDateString('en-US')}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditStock(stock)}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteStock(stock.id)}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Enhanced Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold" component="div">
            {editingStock ? '✏️ Edit Stock' : '➕ Add New Stock'}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {editingStock ? 'Update alert thresholds' : 'Select stock and set alert thresholds'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Stock Symbol"
            placeholder="e.g. AAPL, MSFT, GOOGL"
            fullWidth
            variant="outlined"
            value={stockForm.symbol}
            onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value.toUpperCase() })}
            disabled={!!editingStock}
            sx={{ mb: 3 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          <TextField
            margin="dense"
            label="Minimum Price"
            placeholder="Alert when price drops below..."
            fullWidth
            variant="outlined"
            type="number"
            value={stockForm.minPrice || ''}
            onChange={(e) => setStockForm({
              ...stockForm,
              minPrice: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            sx={{ mb: 3 }}
            InputProps={{
              sx: { borderRadius: 2 },
              startAdornment: <TrendingDown color="error" sx={{ mr: 1 }} />
            }}
          />
          <TextField
            margin="dense"
            label="Maximum Price"
            placeholder="Alert when price rises above..."
            fullWidth
            variant="outlined"
            type="number"
            value={stockForm.maxPrice || ''}
            onChange={(e) => setStockForm({
              ...stockForm,
              maxPrice: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            InputProps={{
              sx: { borderRadius: 2 },
              startAdornment: <TrendingUp color="success" sx={{ mr: 1 }} />
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveStock}
            variant="contained"
            disabled={!stockForm.symbol}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(45deg, #00d4aa, #01a3ff)',
            }}
          >
            {editingStock ? 'Save Changes' : 'Add to Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
