import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Paper,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Notifications,
  ExitToApp,
  Person,
  Menu as MenuIcon,
  TrendingUp,
  Home,
  ShowChart
} from '@mui/icons-material';
import AuthComponent from './components/AuthComponent';
import Dashboard from './components/Dashboard';
import AlertsComponent from './components/AlertsComponent';
import TrendingStocks from './components/TrendingStocks';
import { authService, alertService } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#0a0e27',
      paper: '#1a1d3a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
  },
});

interface User {
  username: string;
  email: string;
}

const drawerWidth = 280;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token != null && savedUser != null) {
      setUser(JSON.parse(savedUser));
      loadUnreadCount();
    }

    // Nasłuchiwanie zmian w localStorage (wylogowanie w innych kartach)
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setUser(null);
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await alertService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Ciche niepowodzenie - nie logujemy błędu gdy serwer nie jest dostępny
      setUnreadCount(0);
    }
  };

  const handleLogin = (token: string, userData: User) => {
    setUser(userData);
    loadUnreadCount();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPage('dashboard');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home />, description: 'Your stocks' },
    { id: 'trending', label: 'Trending', icon: <TrendingUp />, description: 'Popular stocks' },
    { id: 'alerts', label: 'Alerts', icon: <Notifications />, description: 'Notifications', badge: unreadCount },
    { id: 'docs', label: 'API Documentation', icon: <ShowChart />, description: 'Swagger UI' },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" fontWeight="bold" sx={{
          background: 'linear-gradient(45deg, #00d4aa, #ff4081)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          📊 StockWatch
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time stock monitoring
        </Typography>
      </Box>
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => {
              if (item.id === 'docs') {
                // Otwórz dokumentację API w nowej karcie
                window.open('http://localhost:8080/swagger-ui.html', '_blank');
              } else {
                setCurrentPage(item.id);
                if (isMobile) setMobileOpen(false);
              }
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              backgroundColor: currentPage === item.id ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
              color: currentPage === item.id ? '#ffffff' : 'inherit',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: currentPage === item.id ? 'rgba(0, 212, 170, 0.25)' : 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <ListItemIcon sx={{
              color: currentPage === item.id ? '#ffffff' : 'primary.main',
              minWidth: 40
            }}>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{
                fontWeight: currentPage === item.id ? 600 : 400,
                color: currentPage === item.id ? '#ffffff' : 'inherit'
              }}
              secondaryTypographyProps={{
                color: currentPage === item.id ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthComponent onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'background.paper',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'none',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Paper sx={{
              px: 2,
              py: 0.5,
              backgroundColor: 'rgba(0, 212, 170, 0.1)',
              border: '1px solid rgba(0, 212, 170, 0.3)',
              mr: 2
            }}>
              <Typography variant="body2" color="primary">
                Welcome, {user.username}!
              </Typography>
            </Paper>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #00d4aa, #ff4081)',
                fontWeight: 'bold'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 200 }
              }}
            >
              <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" fontWeight="bold">{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: 'background.paper',
                borderRight: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: 'background.paper',
                borderRight: '1px solid rgba(255,255,255,0.1)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 7, sm: 8 },
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {currentPage === 'dashboard' ? <Dashboard /> : null}
          {currentPage === 'alerts' ? <AlertsComponent /> : null}
          {currentPage === 'trending' ? <TrendingStocks /> : null}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
