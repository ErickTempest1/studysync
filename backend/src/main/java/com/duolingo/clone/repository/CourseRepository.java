package com.duolingo.clone.repository;

import com.duolingo.clone.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

// <Course, Long> significa: Repositório da entidade "Course" onde o ID é do tipo "Long"
public interface CourseRepository extends JpaRepository<Course, Long> {
}