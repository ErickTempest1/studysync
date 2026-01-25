package com.duolingo.clone.controller;

import com.duolingo.clone.model.Course;
import com.duolingo.clone.repository.CourseRepository;
import com.duolingo.clone.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:5173") // Libera o React
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GeminiService geminiService;

    // 1. Listar todos os cursos (O que o seu site já está usando)
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 2. O NOVO PODER: Gerar lição com IA (Teste simples)
    // Vamos chamar isso no navegador para testar o cérebro
    @GetMapping("/test-ai")
    public String testarIA() {
        return geminiService.gerarExercicio("Java Streams");
    }
}