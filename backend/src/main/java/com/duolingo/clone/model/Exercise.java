package com.duolingo.clone.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000) // Aumentando tamanho pra caber perguntas grandes
    private String prompt;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private Lesson lesson;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    private List<ExerciseOption> options = new ArrayList<>();

    public Exercise() {}

    // CONSTRUTOR QUE FALTAVA:
    public Exercise(String prompt, Lesson lesson) {
        this.prompt = prompt;
        this.lesson = lesson;
    }

    public Long getId() { return id; }
    public String getPrompt() { return prompt; }
    public List<ExerciseOption> getOptions() { return options; }

    // Helper para pegar a resposta certa (útil pro Frontend antigo, mas o novo usa a lista de options)
    public String getCorrectAnswer() {
        return options.stream()
                .filter(ExerciseOption::isCorrect)
                .map(ExerciseOption::getText)
                .findFirst()
                .orElse("");
    }
}