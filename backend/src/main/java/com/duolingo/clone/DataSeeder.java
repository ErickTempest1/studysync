package com.duolingo.clone;

import com.duolingo.clone.model.*;
import com.duolingo.clone.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. LIMPEZA TOTAL (Apaga o curso antigo de Inglês para não misturar)
        courseRepository.deleteAll();

        // 2. Criar o Curso de Programação
        Course course = new Course();
        course.setTitle("Lógica com JavaScript");
        course.setSourceLang("Human");
        course.setTargetLang("Machine");

        // --- UNIDADE 1: Variáveis ---
        Unit unit1 = new Unit();
        unit1.setTitle("Variáveis e Tipos");
        unit1.setOrderIndex(1);
        unit1.setColor("#3B82F6"); // Azul Tech
        unit1.setCourse(course);

        // Lição 1.1: O Básico
        Lesson lesson1 = new Lesson();
        lesson1.setTitle("Primeiros Passos");
        lesson1.setOrderIndex(1);
        lesson1.setTotalXp(15);
        lesson1.setUnit(unit1);

        // Exercício 1: String vs Number
        Exercise ex1 = new Exercise();
        ex1.setType(ExerciseType.MULTIPLE_CHOICE);
        ex1.setPrompt("Qual é o tipo de dado de: 'BMO'?");
        ex1.setCorrectAnswer("String");
        ex1.setLesson(lesson1);

        ExerciseOption opt1a = new ExerciseOption("Number", false, ex1);
        ExerciseOption opt1b = new ExerciseOption("String", true, ex1); // Correta
        ExerciseOption opt1c = new ExerciseOption("Boolean", false, ex1);
        ExerciseOption opt1d = new ExerciseOption("Undefined", false, ex1);
        ex1.setOptions(List.of(opt1a, opt1b, opt1c, opt1d));

        // Exercício 2: Declaração
        Exercise ex2 = new Exercise();
        ex2.setType(ExerciseType.MULTIPLE_CHOICE);
        ex2.setPrompt("Como declaramos uma variável constante?");
        ex2.setCorrectAnswer("const");
        ex2.setLesson(lesson1);

        ExerciseOption opt2a = new ExerciseOption("var", false, ex2);
        ExerciseOption opt2b = new ExerciseOption("let", false, ex2);
        ExerciseOption opt2c = new ExerciseOption("const", true, ex2); // Correta
        ex2.setOptions(List.of(opt2a, opt2b, opt2c));

        // Lição 1.2: Prática
        Lesson lesson2 = new Lesson();
        lesson2.setTitle("Console.log");
        lesson2.setOrderIndex(2);
        lesson2.setTotalXp(20);
        lesson2.setUnit(unit1);
        // (Deixei essa lição vazia de exercícios por enquanto só para aparecer no mapa)


        // --- UNIDADE 2: Condicionais (Bloqueada visualmente) ---
        Unit unit2 = new Unit();
        unit2.setTitle("Condicionais (If/Else)");
        unit2.setOrderIndex(2);
        unit2.setColor("#10B981"); // Verde Matrix
        unit2.setCourse(course);

        Lesson lesson3 = new Lesson();
        lesson3.setTitle("Tomando Decisões");
        lesson3.setOrderIndex(1);
        lesson3.setUnit(unit2);


        // --- AMARRAR TUDO E SALVAR ---
        lesson1.setExercises(List.of(ex1, ex2));

        unit1.setLessons(List.of(lesson1, lesson2));
        unit2.setLessons(List.of(lesson3));

        course.setUnits(List.of(unit1, unit2));

        courseRepository.save(course);
        System.out.println("------ 🐧 BMO: DADOS DE PROGRAMAÇÃO CARREGADOS! ------");
    }
}