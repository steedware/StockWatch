package org.example.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class StockPriceService {

    @Value("${stock.api.base-url}")
    private String apiBaseUrl;

    @Value("${stock.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public StockPriceService() {
        this.webClient = WebClient.builder().build();
    }

    public BigDecimal getCurrentPrice(String symbol) {
        try {
            String url = String.format("%s/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
                                     apiBaseUrl, symbol, apiKey);

            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || !response.containsKey("Global Quote")) {
                throw new RuntimeException("Invalid API response for symbol: " + symbol);
            }

            Map<String, String> quote = (Map<String, String>) response.get("Global Quote");
            String priceStr = quote.get("05. price");

            if (priceStr == null || priceStr.isEmpty()) {
                throw new RuntimeException("Price not found for symbol: " + symbol);
            }

            return new BigDecimal(priceStr);

        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to fetch price for symbol: " + symbol + ". Error: " + e.getMessage());
        } catch (Exception e) {
            if (symbol.equals("DEMO") || apiKey.equals("demo")) {
                return generateMockPrice(symbol);
            }
            throw new RuntimeException("Error fetching price for symbol: " + symbol + ". " + e.getMessage());
        }
    }

    private BigDecimal generateMockPrice(String symbol) {
        int hash = symbol.hashCode();
        double basePrice = 50 + (hash % 200);
        double variation = (System.currentTimeMillis() % 10000) / 100.0 - 50;
        return BigDecimal.valueOf(Math.max(1.0, basePrice + variation)).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
