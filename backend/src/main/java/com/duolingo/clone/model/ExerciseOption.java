package com.duolingo.clone.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ExerciseOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private Boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    @JsonIgnore // Evita loop infinito no JSON
    private Exercise exercise;

    // --- O CONSTRUTOR QUE FALTAVA ---
    public ExerciseOption(String text, Boolean isCorrect, Exercise exercise) {
        this.text = text;
        this.isCorrect = isCorrect;
        this.exercise = exercise;
    }
}