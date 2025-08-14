# StockWatch - Render Deployment Instructions

## 🚀 Automatyczny Deployment na Render

### Krok 1: Przygotowanie repozytorium
```bash
# Dodaj wszystkie pliki do repozytorium
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### Krok 2: Deploy na Render
1. Idź na **render.com** i zaloguj się
2. Kliknij **"New"** → **"Blueprint"**
3. Połącz swoje konto GitHub
4. Wybierz repozytorium **StockWatch**
5. Kliknij **"Create Services"**

Render automatycznie:
- Utworzy bazę danych PostgreSQL
- Zdeployuje backend API
- Zdeployuje frontend jako static site
- Skonfiguruje wszystkie zmienne środowiskowe

### Krok 3: URLs po deployment
- **Frontend**: `https://stockwatch-frontend.onrender.com`
- **Backend API**: `https://stockwatch-api.onrender.com`
- **API Docs**: `https://stockwatch-api.onrender.com/swagger-ui.html`

### ⚙️ Zmienne środowiskowe (auto-konfigurowane)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Auto-generated secure key
- `REACT_APP_API_URL` - Automatycznie linkowane z backend

### 🔧 Manual Deployment (alternatywa)
Jeśli preferujesz manual setup:

1. **Backend Service**:
   - Type: Web Service
   - Environment: Java
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -Dspring.profiles.active=prod -Dserver.port=$PORT -jar target/StockWatch-1.0-SNAPSHOT.jar`

2. **Frontend Service**:
   - Type: Static Site
   - Build Command: `cd frontend && npm ci && npm run build`
   - Publish Directory: `frontend/build`

3. **Database**:
   - Type: PostgreSQL
   - Name: `stockwatch-db`

### 🎯 Następne kroki po deployment
1. Zweryfikuj health check: `/actuator/health`
2. Przetestuj API dokumentację
3. Sprawdź funkcjonalność frontendu
4. Opcjonalnie: ustaw custom domain
