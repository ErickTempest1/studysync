package com.duolingo.clone;

import com.duolingo.clone.model.*;
import com.duolingo.clone.repository.CourseRepository;
import com.duolingo.clone.service.GeminiService; // <--- 1. Importação nova aqui em cima
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GeminiService geminiService; // <--- 2. Injeção do Serviço aqui

    @Override
    public void run(String... args) throws Exception {
        // --- PARTE 1: LIMPEZA E CRIAÇÃO DO CURSO FIXO ---
        courseRepository.deleteAll();

        Course course = new Course();
        course.setTitle("Lógica com JavaScript");
        course.setSourceLang("Human");
        course.setTargetLang("Machine");

        // UNIDADE 1
        Unit unit1 = new Unit();
        unit1.setTitle("Variáveis e Tipos");
        unit1.setOrderIndex(1);
        unit1.setColor("#3B82F6");
        unit1.setCourse(course);

        // Lição 1.1
        Lesson lesson1 = new Lesson();
        lesson1.setTitle("Primeiros Passos");
        lesson1.setOrderIndex(1);
        lesson1.setTotalXp(15);
        lesson1.setUnit(unit1);

        // Exercícios Fixos (Para garantir que sempre tenha algo)
        Exercise ex1 = new Exercise();
        ex1.setType(ExerciseType.MULTIPLE_CHOICE);
        ex1.setPrompt("Qual é o tipo de dado de: 'BMO'?");
        ex1.setCorrectAnswer("String");
        ex1.setLesson(lesson1);

        ExerciseOption opt1a = new ExerciseOption("Number", false, ex1);
        ExerciseOption opt1b = new ExerciseOption("String", true, ex1);
        ExerciseOption opt1c = new ExerciseOption("Boolean", false, ex1);
        ExerciseOption opt1d = new ExerciseOption("Undefined", false, ex1);
        ex1.setOptions(List.of(opt1a, opt1b, opt1c, opt1d));

        Exercise ex2 = new Exercise();
        ex2.setType(ExerciseType.MULTIPLE_CHOICE);
        ex2.setPrompt("Como declaramos uma variável constante?");
        ex2.setCorrectAnswer("const");
        ex2.setLesson(lesson1);
        ex2.setOptions(List.of(
                new ExerciseOption("var", false, ex2),
                new ExerciseOption("let", false, ex2),
                new ExerciseOption("const", true, ex2)
        ));

        // Lição 1.2
        Lesson lesson2 = new Lesson();
        lesson2.setTitle("Console.log");
        lesson2.setOrderIndex(2);
        lesson2.setTotalXp(20);
        lesson2.setUnit(unit1);

        // UNIDADE 2
        Unit unit2 = new Unit();
        unit2.setTitle("Condicionais (If/Else)");
        unit2.setOrderIndex(2);
        unit2.setColor("#10B981");
        unit2.setCourse(course);

        Lesson lesson3 = new Lesson();
        lesson3.setTitle("Tomando Decisões");
        lesson3.setOrderIndex(1);
        lesson3.setUnit(unit2);

        // Amarrar e Salvar
        lesson1.setExercises(List.of(ex1, ex2));
        unit1.setLessons(List.of(lesson1, lesson2));
        unit2.setLessons(List.of(lesson3));
        course.setUnits(List.of(unit1, unit2));

        courseRepository.save(course);
        System.out.println("------ 🐧 BMO: DADOS FIXOS CARREGADOS! ------");

        // --- PARTE 2: TESTE DO CÉREBRO (IA) ---
        // Isso vai aparecer no console do IntelliJ quando você rodar
        System.out.println("🐧 BMO: Conectando na Matrix para gerar questão nova...");
        try {
            String jsonDaIA = geminiService.gerarExercicio("Loop For em JavaScript");
            System.out.println("🐧 RESPOSTA DA IA (JSON): " + jsonDaIA);
        } catch (Exception e) {
            System.out.println("🐧 BMO: Falha na conexão com a IA (verifique a chave): " + e.getMessage());
        }
    }
}