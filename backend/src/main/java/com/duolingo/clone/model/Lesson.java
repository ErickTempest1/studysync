package com.duolingo.clone.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // Ex: "Lição 1"
    private Integer orderIndex;
    private Integer totalXp;    // Ex: 10 XP

    @ManyToOne
    @JoinColumn(name = "unit_id")
    @JsonIgnore // <--- Adicione esta linha
    private Unit unit;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Exercise> exercises;
}
