## 🚀 StockWatch - Deployment na Render

### Instrukcje deployment:

1. **Utwórz repozytorium GitHub:**
   - Idź na github.com
   - Kliknij "New repository"
   - Nazwa: `StockWatch`
   - Ustaw jako Public
   - Kliknij "Create repository"

2. **Połącz lokalne repo z GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/StockWatch.git
git branch -M main
git push -u origin main
```

3. **Deploy na Render:**
   - Idź na render.com
   - Kliknij "New" → "Blueprint"
   - Połącz GitHub account
   - Wybierz repozytorium "StockWatch"
   - Kliknij "Create Services"

### ✅ Render automatycznie:
- Utworzy PostgreSQL database (stockwatch-db)
- Zdeployuje backend API (stockwatch-api)
- Zdeployuje frontend (stockwatch-frontend)
- Skonfiguruje wszystkie zmienne środowiskowe

### 🌐 URLs po deployment:
- Frontend: https://stockwatch-frontend.onrender.com
- Backend: https://stockwatch-api.onrender.com
- API Docs: https://stockwatch-api.onrender.com/swagger-ui.html

### 🔧 Co zostało przygotowane:
✅ render.yaml - Konfiguracja Blueprint
✅ application-prod.yml - Konfiguracja produkcyjna
✅ Dockerfile - Optymalizowany build
✅ Deploy scripts - Automatyczne skrypty
✅ JWT Authentication - Naprawiony
✅ CORS Configuration - Skonfigurowany
✅ Database migrations - Flyway setup
✅ Health checks - Endpoint /actuator/health
