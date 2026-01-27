package com.duolingo.clone.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int orderIndex;

    @ManyToOne
    @JoinColumn(name = "unit_id")
    @JsonIgnore
    private Unit unit;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Exercise> exercises = new ArrayList<>();

    public Lesson() {}

    // CONSTRUTOR QUE FALTAVA:
    public Lesson(String title, int orderIndex, Unit unit) {
        this.title = title;
        this.orderIndex = orderIndex;
        this.unit = unit;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public List<Exercise> getExercises() { return exercises; }
}