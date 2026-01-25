package com.duolingo.clone.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ExerciseOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    @JsonBackReference
    private Exercise exercise;

    // --- 1. Construtor Vazio (A PEÇA QUE FALTAVA!) ---
    // O Java precisa disso para transformar o objeto em JSON para o site
    public ExerciseOption() {
    }

    // --- 2. Construtor Cheio (Para o DataSeeder) ---
    public ExerciseOption(String text, boolean isCorrect, Exercise exercise) {
        this.text = text;
        this.isCorrect = isCorrect;
        this.exercise = exercise;
    }

    // --- 3. Getters e Setters Manuais ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    // Atenção: para booleanos, o padrão é "is..."
    public boolean isCorrect() { return isCorrect; }
    public void setCorrect(boolean correct) { isCorrect = correct; }

    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
}