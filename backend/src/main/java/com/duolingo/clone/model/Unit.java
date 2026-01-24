package com.duolingo.clone.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "units")
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // Ex: "Saudações"
    private Integer orderIndex; // 1, 2, 3... (ordem na tela)
    private String color;       // Cor do tema visual

    // Muitas unidades pertencem a UM curso
    @ManyToOne
    @JoinColumn(name = "course_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // <--- Adicione esta linha
    private Course course;

    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL)
    private List<Lesson> lessons;
}