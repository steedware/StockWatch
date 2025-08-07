package org.example.service;
import org.example.dto.WatchedStockRequest;
import org.example.dto.WatchedStockResponse;
import org.example.entity.User;
import org.example.entity.WatchedStock;
import org.example.repository.UserRepository;
import org.example.repository.WatchedStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchedStockService {

    @Autowired
    private WatchedStockRepository watchedStockRepository;

    @Autowired
    private UserRepository userRepository;

    public WatchedStockResponse addWatchedStock(WatchedStockRequest request, UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (watchedStockRepository.existsByUserIdAndSymbol(user.getId(), request.getSymbol())) {
            throw new RuntimeException("Stock is already being watched");
        }

        if (request.getMinPrice() != null && request.getMaxPrice() != null &&
            request.getMinPrice().compareTo(request.getMaxPrice()) >= 0) {
            throw new RuntimeException("Minimum price must be less than maximum price");
        }

        WatchedStock watchedStock = new WatchedStock();
        watchedStock.setSymbol(request.getSymbol().toUpperCase());
        watchedStock.setMinPrice(request.getMinPrice());
        watchedStock.setMaxPrice(request.getMaxPrice());
        watchedStock.setUser(user);

        WatchedStock saved = watchedStockRepository.save(watchedStock);

        return mapToResponse(saved);
    }

    public List<WatchedStockResponse> getUserWatchedStocks(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WatchedStock> watchedStocks = watchedStockRepository.findByUserIdAndActiveTrue(user.getId());

        return watchedStocks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public WatchedStockResponse updateWatchedStock(Long id, WatchedStockRequest request, UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        WatchedStock watchedStock = watchedStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Watched stock not found"));

        if (!watchedStock.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (request.getMinPrice() != null && request.getMaxPrice() != null &&
            request.getMinPrice().compareTo(request.getMaxPrice()) >= 0) {
            throw new RuntimeException("Minimum price must be less than maximum price");
        }

        watchedStock.setMinPrice(request.getMinPrice());
        watchedStock.setMaxPrice(request.getMaxPrice());

        WatchedStock updated = watchedStockRepository.save(watchedStock);

        return mapToResponse(updated);
    }

    public void deleteWatchedStock(Long id, UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        WatchedStock watchedStock = watchedStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Watched stock not found"));

        if (!watchedStock.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        watchedStock.setActive(false);
        watchedStockRepository.save(watchedStock);
    }

    private WatchedStockResponse mapToResponse(WatchedStock watchedStock) {
        return new WatchedStockResponse(
            watchedStock.getId(),
            watchedStock.getSymbol(),
            watchedStock.getMinPrice(),
            watchedStock.getMaxPrice(),
            watchedStock.getCreatedAt(),
            watchedStock.isActive()
        );
    }
}

