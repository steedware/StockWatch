import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  Star,
  Visibility,
  Timeline,
  AttachMoney,
} from '@mui/icons-material';
import { watchlistService } from '../services/api';

interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  category: string;
}

const TrendingStocks: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([]);

  useEffect(() => {
    loadTrendingStocks();
  }, []);

  const loadTrendingStocks = async () => {
    try {
      // Symulowane dane najpopularniejszych akcji
      const mockTrendingStocks: TrendingStock[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 193.75,
          change: 2.34,
          changePercent: 1.22,
          volume: 45230000,
          marketCap: '3.01T',
          category: 'technology'
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 378.85,
          change: -1.12,
          changePercent: -0.29,
          volume: 23450000,
          marketCap: '2.81T',
          category: 'technology'
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 140.23,
          change: 3.45,
          changePercent: 2.52,
          volume: 34120000,
          marketCap: '1.78T',
          category: 'technology'
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          price: 248.50,
          change: 12.75,
          changePercent: 5.41,
          volume: 89340000,
          marketCap: '792B',
          category: 'automotive'
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          price: 875.30,
          change: 18.90,
          changePercent: 2.21,
          volume: 67890000,
          marketCap: '2.16T',
          category: 'technology'
        },
        {
          symbol: 'JPM',
          name: 'JPMorgan Chase & Co.',
          price: 168.45,
          change: -0.85,
          changePercent: -0.50,
          volume: 12340000,
          marketCap: '495B',
          category: 'finance'
        },
        {
          symbol: 'JNJ',
          name: 'Johnson & Johnson',
          price: 162.30,
          change: 1.20,
          changePercent: 0.74,
          volume: 8760000,
          marketCap: '428B',
          category: 'healthcare'
        },
        {
          symbol: 'V',
          name: 'Visa Inc.',
          price: 267.89,
          change: 3.21,
          changePercent: 1.21,
          volume: 7890000,
          marketCap: '570B',
          category: 'finance'
        }
      ];

      setTrendingStocks(mockTrendingStocks);
    } catch (error) {
      console.error('Error loading trending stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol: string) => {
    try {
      await watchlistService.addStock({
        symbol,
        minPrice: undefined,
        maxPrice: undefined
      });
      // Show success message
      alert(`Stock ${symbol} has been added to watchlist!`);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You must be logged in to add stock to watchlist. Please log in again.');
      } else {
        alert(`Error adding stock ${symbol} to watchlist. Please try again.`);
      }
      console.error('Error adding to watchlist:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All', count: trendingStocks.length },
    { id: 'technology', label: 'Technology', count: trendingStocks.filter(s => s.category === 'technology').length },
    { id: 'finance', label: 'Finance', count: trendingStocks.filter(s => s.category === 'finance').length },
    { id: 'healthcare', label: 'Healthcare', count: trendingStocks.filter(s => s.category === 'healthcare').length },
    { id: 'automotive', label: 'Automotive', count: trendingStocks.filter(s => s.category === 'automotive').length },
  ];

  const filteredStocks = selectedCategory === 'all'
    ? trendingStocks
    : trendingStocks.filter(stock => stock.category === selectedCategory);

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Loading popular stocks...
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
          🚀 Most Popular Stocks
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover the most trending stocks on the market
        </Typography>
      </Box>

      {/* Categories Filter */}
      <Paper sx={{ p: 2, mb: 4, backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.label} (${category.count})`}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                fontWeight: selectedCategory === category.id ? 600 : 400,
                borderRadius: 2,
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Top Performers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredStocks.slice(0, 3).map((stock, index) => (
          <Grid item xs={12} md={4} key={stock.symbol}>
            <Card sx={{
              background: index === 0
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : index === 1
                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'visible',
            }}>
              <Box sx={{
                position: 'absolute',
                top: -10,
                left: 20,
                backgroundColor: theme.palette.warning.main,
                color: 'black',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
                #{index + 1} TOP
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stock.symbol}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stock.name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => addToWatchlist(stock.symbol)}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h5" fontWeight="bold">
                    ${stock.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getChangeIcon(stock.change)}
                    <Typography variant="body2" fontWeight="bold">
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Vol: {(stock.volume / 1000000).toFixed(1)}M | Cap: {stock.marketCap}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* All Stocks List */}
      <Paper sx={{ backgroundColor: 'background.paper' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h5" fontWeight="bold">
            📈 Stock List
          </Typography>
        </Box>
        <List>
          {filteredStocks.map((stock, index) => (
            <React.Fragment key={stock.symbol}>
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{
                    backgroundColor: 'primary.main',
                    color: 'black',
                    fontWeight: 'bold',
                    width: 50,
                    height: 50,
                  }}>
                    {stock.symbol.substring(0, 2)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold" component="span">
                        {stock.symbol}
                      </Typography>
                      <Chip
                        label={stock.category}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" component="span" sx={{ display: 'block', mb: 0.5 }}>
                        {stock.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Volume: {(stock.volume / 1000000).toFixed(1)}M • Market Cap: {stock.marketCap}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                    ${stock.price.toFixed(2)}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 0.5,
                    color: getChangeColor(stock.change)
                  }}>
                    {getChangeIcon(stock.change)}
                    <Typography variant="body2" fontWeight="bold">
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addToWatchlist(stock.symbol)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </ListItem>
              {index < filteredStocks.length - 1 ? <Divider /> : null}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TrendingStocks;
