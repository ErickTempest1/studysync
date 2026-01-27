package com.duolingo.clone;

import com.duolingo.clone.model.*;
import com.duolingo.clone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CourseRepository courseRepo;
    @Autowired private UnitRepository unitRepo;
    @Autowired private LessonRepository lessonRepo;
    @Autowired private ExerciseRepository exerciseRepo;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepo.count() > 0) return;

        System.out.println("------ 🐧 BMO: RECRIANDO O MAPA (HÍBRIDO) ------");

        Course jsCourse = new Course("Lógica com JavaScript", "from-java");
        courseRepo.save(jsCourse);

        // --- UNIDADE 1 ---
        Unit u1 = new Unit("Fundamentos", 1, "#58cc02", jsCourse);
        unitRepo.save(u1);

        // LIÇÃO 1: FIXA (Tutorial)
        criarLicaoComConteudo(u1, "O que é JavaScript?", 1);

        // LIÇÕES 2 e 3: VAZIAS (A IA vai gerar!)
        criarLicaoParaIA(u1, "Variáveis e Tipos", 2);
        criarLicaoParaIA(u1, "Console e Saída", 3);

        // --- UNIDADE 2 ---
        Unit u2 = new Unit("Condicionais", 2, "#ce82ff", jsCourse);
        unitRepo.save(u2);
        criarLicaoParaIA(u2, "If e Else", 1);
        criarLicaoParaIA(u2, "Lógica Booleana", 2);
        criarLicaoParaIA(u2, "Switch Case", 3);

        // --- UNIDADE 3 ---
        Unit u3 = new Unit("Loops", 3, "#ff9600", jsCourse);
        unitRepo.save(u3);
        criarLicaoParaIA(u3, "Loop For", 1);
        criarLicaoParaIA(u3, "Loop While", 2);

        System.out.println("------ 🐧 BMO: MAPA PRONTO! ------");
    }

    // Cria lição com exercício fixo (Tutorial)
    private void criarLicaoComConteudo(Unit unidade, String titulo, int ordem) {
        Lesson licao = new Lesson(titulo, ordem, unidade);
        lessonRepo.save(licao);

        Exercise ex = new Exercise("Bem-vindo! O JavaScript é uma linguagem usada principalmente para:", licao);
        exerciseRepo.save(ex);

        ex.getOptions().add(new ExerciseOption("Cozinhar", false, ex));
        ex.getOptions().add(new ExerciseOption("Criar páginas Web interativas", true, ex));
        ex.getOptions().add(new ExerciseOption("Fabricar carros", false, ex));
        exerciseRepo.save(ex);
    }

    // Cria lição VAZIA (Isso força o Frontend a chamar a IA)
    private void criarLicaoParaIA(Unit unidade, String titulo, int ordem) {
        Lesson licao = new Lesson(titulo, ordem, unidade);
        lessonRepo.save(licao);
        // Não criamos exercícios aqui. O Frontend vai ver que está vazio e chamar a QuizAPI.
    }
}