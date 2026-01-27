package com.duolingo.clone.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ExerciseOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    @JsonIgnore
    private Exercise exercise;

    public ExerciseOption() {}

    // CONSTRUTOR QUE FALTAVA:
    public ExerciseOption(String text, boolean isCorrect, Exercise exercise) {
        this.text = text;
        this.isCorrect = isCorrect;
        this.exercise = exercise;
    }

    public Long getId() { return id; }
    public String getText() { return text; }
    public boolean isCorrect() { return isCorrect; }
}