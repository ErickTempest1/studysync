package com.duolingo.clone.repository;

import com.duolingo.clone.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitRepository extends JpaRepository<Unit, Long> {
}