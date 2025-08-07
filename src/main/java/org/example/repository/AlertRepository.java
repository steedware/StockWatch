package org.example.repository;

import org.example.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserIdOrderByTriggeredAtDesc(Long userId);
    Page<Alert> findByUserIdOrderByTriggeredAtDesc(Long userId, Pageable pageable);
    List<Alert> findByUserIdAndReadFalseOrderByTriggeredAtDesc(Long userId);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user.id = :userId AND a.read = false")
    long countUnreadByUserId(Long userId);

    @Modifying
    @Query("UPDATE Alert a SET a.read = true WHERE a.user.id = :userId AND a.id IN :alertIds")
    void markAsRead(Long userId, List<Long> alertIds);

    List<Alert> findByTriggeredAtAfter(LocalDateTime dateTime);
}
