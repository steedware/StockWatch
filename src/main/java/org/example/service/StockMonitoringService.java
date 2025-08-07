package org.example.service;

import org.example.entity.Alert;
import org.example.entity.WatchedStock;
import org.example.repository.WatchedStockRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class StockMonitoringService {

    private static final Logger logger = LoggerFactory.getLogger(StockMonitoringService.class);

    @Autowired
    private WatchedStockRepository watchedStockRepository;

    @Autowired
    private StockPriceService stockPriceService;

    @Autowired
    private AlertService alertService;

    @Scheduled(fixedDelayString = "${stock.api.fetch-interval}")
    public void monitorStockPrices() {
        logger.info("Starting stock price monitoring cycle");

        List<WatchedStock> activeWatchedStocks = watchedStockRepository.findAllActive();

        for (WatchedStock watchedStock : activeWatchedStocks) {
            try {
                monitorSingleStock(watchedStock);
            } catch (Exception e) {
                logger.error("Error monitoring stock {}: {}", watchedStock.getSymbol(), e.getMessage());
            }
        }

        logger.info("Completed stock price monitoring cycle for {} stocks", activeWatchedStocks.size());
    }

    private void monitorSingleStock(WatchedStock watchedStock) {
        try {
            BigDecimal currentPrice = stockPriceService.getCurrentPrice(watchedStock.getSymbol());

            logger.debug("Current price for {} is {}", watchedStock.getSymbol(), currentPrice);

            boolean alertTriggered = false;

            if (watchedStock.getMinPrice() != null && currentPrice.compareTo(watchedStock.getMinPrice()) <= 0) {
                alertService.createAlert(
                    currentPrice,
                    watchedStock.getMinPrice(),
                    Alert.AlertType.MIN_PRICE_EXCEEDED,
                    watchedStock.getUser(),
                    watchedStock
                );
                alertTriggered = true;
                logger.info("MIN_PRICE_EXCEEDED alert triggered for {} at price {}",
                           watchedStock.getSymbol(), currentPrice);
            }

            if (watchedStock.getMaxPrice() != null && currentPrice.compareTo(watchedStock.getMaxPrice()) >= 0) {
                alertService.createAlert(
                    currentPrice,
                    watchedStock.getMaxPrice(),
                    Alert.AlertType.MAX_PRICE_EXCEEDED,
                    watchedStock.getUser(),
                    watchedStock
                );
                alertTriggered = true;
                logger.info("MAX_PRICE_EXCEEDED alert triggered for {} at price {}",
                           watchedStock.getSymbol(), currentPrice);
            }

            if (!alertTriggered) {
                logger.debug("No alerts triggered for {} at price {}", watchedStock.getSymbol(), currentPrice);
            }

        } catch (Exception e) {
            logger.error("Failed to fetch price for {}: {}", watchedStock.getSymbol(), e.getMessage());
        }
    }
}

