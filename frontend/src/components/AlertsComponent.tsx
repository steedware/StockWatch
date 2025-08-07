import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Badge,
  Alert as MuiAlert,
  Divider
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from '@mui/icons-material';
import { Alert } from '../types';
import { alertService } from '../services/api';

const AlertsComponent: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAlerts();
    loadUnreadCount();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertsData = await alertService.getAlerts();
      setAlerts(alertsData);
    } catch (err) {
      setError('Error loading alerts');
      setAlerts([]); // Ustawienie pustej listy przy błędzie
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await alertService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Silent failure - set count to 0
      setUnreadCount(0);
    }
  };

  const markAsRead = async (alertIds: number[]) => {
    try {
      await alertService.markAsRead(alertIds);
      setAlerts(alerts.map(alert =>
        alertIds.includes(alert.id) ? { ...alert, read: true } : alert
      ));
      setUnreadCount(Math.max(0, unreadCount - alertIds.length));
    } catch (err) {
      setError('Error marking alerts as read');
    }
  };

  const markAllAsRead = () => {
    const unreadIds = alerts.filter(alert => !alert.read).map(alert => alert.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const getAlertIcon = (alertType: string) => {
    return alertType === 'MAX_PRICE_EXCEEDED' ?
      <TrendingUp color="error" /> :
      <TrendingDown color="error" />;
  };

  const getAlertMessage = (alert: Alert) => {
    const typeText = alert.alertType === 'MAX_PRICE_EXCEEDED'
      ? 'rose above'
      : 'dropped below';

    return `Stock ${alert.symbol} ${typeText} threshold of $${alert.thresholdPrice}. Current price: $${alert.currentPrice}`;
  };

  const filteredAlerts = showOnlyUnread
    ? alerts.filter(alert => !alert.read)
    : alerts;

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          Loading alerts...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🔔 Alerts
        </Typography>
        <Box>
          <Button
            variant={showOnlyUnread ? "contained" : "outlined"}
            onClick={() => setShowOnlyUnread(!showOnlyUnread)}
            startIcon={
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            }
            sx={{ mr: 2 }}
          >
            {showOnlyUnread ? 'All' : 'Unread'}
          </Button>
          {unreadCount > 0 ? (
            <Button
              variant="contained"
              color="success"
              onClick={markAllAsRead}
              startIcon={<CheckCircle />}
            >
              Mark all as read
            </Button>
          ) : null}
        </Box>
      </Box>

      {error ? (
        <MuiAlert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </MuiAlert>
      ) : null}

      {filteredAlerts.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <NotificationsOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              {showOnlyUnread ? 'No unread alerts' : 'No alerts'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {showOnlyUnread
                ? 'All alerts have been read'
                : 'Alerts will appear here when stock prices exceed set thresholds'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List>
            {filteredAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <ListItem
                  sx={{
                    bgcolor: alert.read ? 'transparent' : 'action.hover',
                    borderLeft: !alert.read ? '4px solid' : 'none',
                    borderLeftColor: 'primary.main'
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {getAlertIcon(alert.alertType)}
                  </Box>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={alert.read ? 'normal' : 'bold'}
                        >
                          {alert.symbol}
                        </Typography>
                        <Chip
                          label={alert.alertType === 'MAX_PRICE_EXCEEDED' ? 'Max exceeded' : 'Min exceeded'}
                          color={alert.alertType === 'MAX_PRICE_EXCEEDED' ? 'error' : 'warning'}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                        {!alert.read ? (
                          <Chip
                            label="NEW"
                            color="primary"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        ) : null}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textPrimary">
                          {getAlertMessage(alert)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(alert.triggeredAt).toLocaleString('en-US')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!alert.read ? (
                      <IconButton
                        edge="end"
                        onClick={() => markAsRead([alert.id])}
                        color="primary"
                      >
                        <CheckCircle />
                      </IconButton>
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredAlerts.length - 1 ? <Divider /> : null}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Container>
  );
};

export default AlertsComponent;
