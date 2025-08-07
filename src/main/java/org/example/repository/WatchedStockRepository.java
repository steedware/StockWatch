package org.example.repository;

import org.example.entity.WatchedStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchedStockRepository extends JpaRepository<WatchedStock, Long> {
    List<WatchedStock> findByUserIdAndActiveTrue(Long userId);
    List<WatchedStock> findByUserId(Long userId);

    @Query("SELECT DISTINCT ws.symbol FROM WatchedStock ws WHERE ws.active = true")
    List<String> findAllActiveSymbols();

    @Query("SELECT ws FROM WatchedStock ws WHERE ws.active = true")
    List<WatchedStock> findAllActive();

    boolean existsByUserIdAndSymbol(Long userId, String symbol);
}
