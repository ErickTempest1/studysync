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
        // Só cria se o banco estiver vazio
        if (courseRepository.count() == 0) {

            // 1. Criar o Curso
            Course course = new Course();
            course.setTitle("Inglês para Portugueses");
            course.setSourceLang("PT-BR");
            course.setTargetLang("EN-US");

            // 2. Criar a Unidade
            Unit unit = new Unit();
            unit.setTitle("Introdução");
            unit.setOrderIndex(1);
            unit.setColor("#58CC02");
            unit.setCourse(course);

            // 3. Criar a Lição (A novidade começa aqui!)
            Lesson lesson = new Lesson();
            lesson.setTitle("Lição 1");
            lesson.setOrderIndex(1);
            lesson.setTotalXp(10);
            lesson.setUnit(unit);

            // 4. Criar um Exercício (Múltipla Escolha)
            Exercise exercise = new Exercise();
            exercise.setType(ExerciseType.MULTIPLE_CHOICE); // Certifique-se que o Enum existe
            exercise.setPrompt("Como se diz 'O gato'?");
            exercise.setCorrectAnswer("The cat");
            exercise.setLesson(lesson);

            // 5. Criar as Opções de Resposta
            ExerciseOption opt1 = new ExerciseOption();
            opt1.setText("The dog");
            opt1.setIsCorrect(false);
            opt1.setExercise(exercise);

            ExerciseOption opt2 = new ExerciseOption();
            opt2.setText("The cat");
            opt2.setIsCorrect(true);
            opt2.setExercise(exercise);

            ExerciseOption opt3 = new ExerciseOption();
            opt3.setText("The milk");
            opt3.setIsCorrect(false);
            opt3.setExercise(exercise);

            // 6. Amarrar tudo (Listas)
            exercise.setOptions(List.of(opt1, opt2, opt3));
            lesson.setExercises(List.of(exercise));
            unit.setLessons(List.of(lesson));
            course.setUnits(List.of(unit));

            // 7. Salvar tudo de uma vez (Cascade faz a mágica)
            courseRepository.save(course);

            System.out.println("------ DADOS COMPLETOS (COM LIÇÕES) CRIADOS! ------");
        }
    }
}