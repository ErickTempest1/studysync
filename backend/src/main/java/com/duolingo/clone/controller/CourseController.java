package com.duolingo.clone.controller;

import com.duolingo.clone.model.Course;
import com.duolingo.clone.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses") // Todas as URLs aqui começam com /courses
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // GET /courses -> Lista todos os cursos do banco
    @GetMapping
    public List<Course> listAll() {
        return courseRepository.findAll();
    }

    // POST /courses -> Cria um novo curso
    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseRepository.save(course);
    }
}
