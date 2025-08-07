import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/api';

interface AuthComponentProps {
  onLogin: (token: string, user: any) => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState<LoginRequest>({ username: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        email: response.email
      }));
      onLogin(response.token, { username: response.username, email: response.email });
    } catch (err: any) {
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(registerData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        email: response.email
      }));
      onLogin(response.token, { username: response.username, email: response.email });
    } catch (err: any) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            📊 StockWatch
          </Typography>

          <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : null}

          {activeTab === 0 ? (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthComponent;
