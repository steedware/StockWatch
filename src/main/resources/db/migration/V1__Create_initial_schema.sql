CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE watched_stocks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_user_symbol UNIQUE(user_id, symbol)
);

CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    watched_stock_id BIGINT NOT NULL REFERENCES watched_stocks(id) ON DELETE CASCADE,
    current_price DECIMAL(10,2) NOT NULL,
    threshold_price DECIMAL(10,2) NOT NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('MIN_PRICE_EXCEEDED', 'MAX_PRICE_EXCEEDED')),
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_watched_stocks_user_active ON watched_stocks(user_id, is_active);
CREATE INDEX idx_watched_stocks_symbol ON watched_stocks(symbol);
CREATE INDEX idx_alerts_user_triggered ON alerts(user_id, triggered_at DESC);
CREATE INDEX idx_alerts_user_read ON alerts(user_id, is_read);
