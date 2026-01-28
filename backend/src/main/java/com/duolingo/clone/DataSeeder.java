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
        // Limpa tudo para recriar o mapa novo
        if (courseRepo.count() > 0) {
            // Se quiser forçar a recriação, descomente as linhas abaixo (cuidado, apaga tudo):
            // exerciseRepo.deleteAll();
            // lessonRepo.deleteAll();
            // unitRepo.deleteAll();
            // courseRepo.deleteAll();
            return;
        }

        System.out.println("------ 🐧 BMO: CRIANDO CURRÍCULO 'DO ZERO AO MESTRE' ------");

        Course jsCourse = new Course("JavaScript: Do Zero ao Mestre", "from-java");
        courseRepo.save(jsCourse);

        // =================================================================================
        // UNIDADE 1: O INÍCIO (Básico Absoluto)
        // =================================================================================
        Unit u1 = new Unit("Introdução ao Código", 1, "#58cc02", jsCourse); // Verde
        unitRepo.save(u1);

        // Lição 1: O Hello World (Ensina console.log)
        criarLicaoEducativa(u1, "Seu Primeiro Código", 1,
                "Bem-vindo! Em programação, usamos comandos para falar com o computador.\n\nO comando 'console.log(...)' serve para escrever uma mensagem na tela.",
                "Qual comando usamos para mostrar uma mensagem na tela?",
                "console.log('Olá')",
                new String[]{"print('Olá')", "console.log('Olá')", "show.message('Olá')", "escreva('Olá')"}
        );

        // Lição 2: Texto vs Números (Ensina Tipos)
        criarLicaoEducativa(u1, "Texto e Números", 2,
                "Computadores diferenciam letras de números.\nTexto (String) deve estar entre aspas: 'BMO'.\nNúmeros não precisam de aspas: 42.",
                "Qual destas opções é considerada um Texto (String)?",
                "'10'",
                new String[]{"10", "'10'", "true", "undefined"}
        );

        criarLicaoParaIA(u1, "Prática: Tipos de Dados", 3);


        // =================================================================================
        // UNIDADE 2: VARIÁVEIS (Memória)
        // =================================================================================
        Unit u2 = new Unit("Guardando Informações", 2, "#1cb0f6", jsCourse); // Azul
        unitRepo.save(u2);

        // Lição 1: O que é Variável?
        criarLicaoEducativa(u2, "O Conceito de Variável", 1,
                "Imagine que uma variável é uma caixa com uma etiqueta.\nUsamos 'let' para criar a caixa e guardar algo dentro.\nExemplo: let nome = 'Erick';",
                "Como criamos uma variável chamada 'pontos' valendo 10?",
                "let pontos = 10;",
                new String[]{"variável pontos = 10;", "let pontos = 10;", "pontos : 10", "crie pontos 10"}
        );

        criarLicaoParaIA(u2, "Constantes (const)", 2);
        criarLicaoParaIA(u2, "Prática de Variáveis", 3);


        // =================================================================================
        // UNIDADE 3: LÓGICA (Decisões)
        // =================================================================================
        Unit u3 = new Unit("Tomando Decisões", 3, "#ce82ff", jsCourse); // Roxo
        unitRepo.save(u3);

        criarLicaoEducativa(u3, "Verdadeiro ou Falso?", 1,
                "O computador só entende sim ou não.\nChamamos isso de Boolean.\nTRUE = Verdadeiro\nFALSE = Falso",
                "Qual o resultado de: 10 > 5 (10 é maior que 5)?",
                "true",
                new String[]{"true", "false", "maybe", "10"}
        );

        criarLicaoEducativa(u3, "O comando IF (Se)", 2,
                "Usamos o 'if' para executar um código APENAS SE uma condição for verdadeira.\nEx: if (fome) { comer() }",
                "Quando o código dentro do 'if' é executado?",
                "Quando a condição for true",
                new String[]{"Sempre", "Nunca", "Quando a condição for true", "Quando a condição for false"}
        );

        criarLicaoParaIA(u3, "Prática de If/Else", 3);


        // =================================================================================
        // UNIDADE 4: LOOPS (Repetição)
        // =================================================================================
        Unit u4 = new Unit("Laços de Repetição", 4, "#ff9600", jsCourse); // Laranja
        unitRepo.save(u4);

        criarLicaoEducativa(u4, "Repetindo coisas", 1,
                "Para não escrevermos o mesmo código 1000 vezes, usamos Loops.\nO 'for' é o mais comum para contagens.",
                "Para que serve um Loop?",
                "Repetir um bloco de código",
                new String[]{"Parar o código", "Repetir um bloco de código", "Criar variáveis", "Deletar dados"}
        );

        criarLicaoParaIA(u4, "Loop While", 2);
        criarLicaoParaIA(u4, "Desafio de Loops", 3);


        // =================================================================================
        // UNIDADE 5: FUNÇÕES (Avançado)
        // =================================================================================
        Unit u5 = new Unit("Criando Funções", 5, "#ff4b4b", jsCourse); // Vermelho
        unitRepo.save(u5);

        criarLicaoEducativa(u5, "O que é Função?", 1,
                "Função é um bloco de código que tem um nome e pode ser reutilizado.\nEx: function pular() { ... }",
                "Como chamamos (executamos) uma função chamada 'iniciar'?",
                "iniciar()",
                new String[]{"iniciar", "run iniciar", "iniciar()", "function iniciar"}
        );

        criarLicaoParaIA(u5, "Parâmetros e Retorno", 2);
        criarLicaoParaIA(u5, "Arrow Functions", 3);


        System.out.println("------ 🐧 BMO: MAPA EDUCACIONAL CONSTRUÍDO! ------");
    }

    // --- MÉTODOS AUXILIARES ---

    // Cria uma lição educativa com explicação teórica antes da pergunta
    private void criarLicaoEducativa(Unit unidade, String tituloLicao, int ordem, String explicacao, String pergunta, String respCorreta, String[] opcoes) {
        Lesson licao = new Lesson(tituloLicao, ordem, unidade);
        lessonRepo.save(licao);

        // Cria o exercício com a explicação formatada no prompt
        String promptCompleto = explicacao + "\n\n❓ PERGUNTA: " + pergunta;
        Exercise ex = new Exercise(promptCompleto, licao);
        exerciseRepo.save(ex);

        for (String opTexto : opcoes) {
            boolean isCorrect = opTexto.equals(respCorreta);
            ex.getOptions().add(new ExerciseOption(opTexto, isCorrect, ex));
        }
        exerciseRepo.save(ex);
    }

    // Cria lição vazia para a IA preencher
    private void criarLicaoParaIA(Unit unidade, String titulo, int ordem) {
        Lesson licao = new Lesson(titulo, ordem, unidade);
        lessonRepo.save(licao);
    }
}