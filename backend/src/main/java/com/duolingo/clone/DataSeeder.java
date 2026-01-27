package com.duolingo.clone;

import com.duolingo.clone.model.*;
import com.duolingo.clone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CourseRepository courseRepo;
    @Autowired private UnitRepository unitRepo;
    @Autowired private LessonRepository lessonRepo;
    @Autowired private ExerciseRepository exerciseRepo;

    @Override
    public void run(String... args) throws Exception {
        // Limpa o banco para não duplicar se reiniciar
        if (courseRepo.count() > 0) return;

        System.out.println("------ 🐧 BMO: CONSTRUINDO O MAPA DE JAVASCRIPT ------");

        // 1. Criar o Curso
        Course jsCourse = new Course("Lógica com JavaScript", "from-java");
        courseRepo.save(jsCourse);

        // --- UNIDADE 1: FUNDAMENTOS (Azul) ---
        Unit u1 = new Unit("Fundamentos e Variáveis", 1, "#58cc02", jsCourse);
        unitRepo.save(u1);
        criarLicao(u1, "O que é JavaScript?", 1);
        criarLicao(u1, "Variáveis (var, let, const)", 2);
        criarLicao(u1, "Tipos de Dados", 3);

        // --- UNIDADE 2: LÓGICA BOOLEANA (Verde) ---
        Unit u2 = new Unit("Condicionais (If/Else)", 2, "#ce82ff", jsCourse);
        unitRepo.save(u2);
        criarLicao(u2, "Operadores de Comparação", 1);
        criarLicao(u2, "Estrutura If/Else", 2);
        criarLicao(u2, "Operadores Lógicos (&&, ||)", 3);

        // --- UNIDADE 3: LOOPS (Laranja) ---
        Unit u3 = new Unit("Laços de Repetição", 3, "#ff9600", jsCourse);
        unitRepo.save(u3);
        criarLicao(u3, "Loop For", 1);
        criarLicao(u3, "Loop While", 2);
        criarLicao(u3, "Break e Continue", 3);

        // --- UNIDADE 4: FUNÇÕES (Vermelho) ---
        Unit u4 = new Unit("Funções e Escopo", 4, "#ff4b4b", jsCourse);
        unitRepo.save(u4);
        criarLicao(u4, "Declarando Funções", 1);
        criarLicao(u4, "Parâmetros e Retorno", 2);
        criarLicao(u4, "Arrow Functions", 3);

        // --- UNIDADE 5: ARRAYS & OBJETOS (Azul Escuro) ---
        Unit u5 = new Unit("Estruturas de Dados", 5, "#1cb0f6", jsCourse);
        unitRepo.save(u5);
        criarLicao(u5, "Criando Arrays", 1);
        criarLicao(u5, "Objetos Literais", 2);
        criarLicao(u5, "Manipulação de Listas", 3);

        System.out.println("------ 🐧 BMO: MAPA CONSTRUÍDO COM SUCESSO! ------");
    }

    // Função auxiliar para criar lições vazias (que usarão a IA)
    private void criarLicao(Unit unidade, String titulo, int ordem) {
        Lesson licao = new Lesson(titulo, ordem, unidade);
        lessonRepo.save(licao);

        // Criar UM exercício fixo de introdução para cada lição
        // Para que o usuário não caia direto na IA sem saber o tema
        Exercise ex = new Exercise(
                "Conceito: " + titulo + ". Clique em Verificar para iniciar o desafio prático!",
                licao
        );
        exerciseRepo.save(ex);

        // Opções dummy (apenas para passar a tela inicial)
        ex.getOptions().add(new ExerciseOption("Entendi!", true, ex));
        ex.getOptions().add(new ExerciseOption("Explique mais", false, ex));
        exerciseRepo.save(ex); // O cascade salva as options
    }
}