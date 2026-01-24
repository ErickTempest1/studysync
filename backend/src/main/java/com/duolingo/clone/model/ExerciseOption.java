package com.duolingo.clone.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exercise_options")
public class ExerciseOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;        // Texto da opção
    private Boolean isCorrect;  // É a correta?

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    @JsonIgnore // <--- Adicione esta linha
    private Exercise exercise;
}