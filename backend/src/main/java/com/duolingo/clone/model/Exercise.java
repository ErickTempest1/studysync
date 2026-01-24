package com.duolingo.clone.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usamos um Enum para saber se é tradução ou múltipla escolha
    @Enumerated(EnumType.STRING)
    private ExerciseType type;

    @Column(columnDefinition = "TEXT")
    private String prompt;          // A pergunta
    private String correctAnswer;   // A resposta certa

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @JsonIgnore // <--- Adicione esta linha
    private Lesson lesson;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    private List<ExerciseOption> options;
}