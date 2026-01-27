package com.duolingo.clone.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String fromLanguage;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Unit> units = new ArrayList<>();

    public Course() {} // Construtor Vazio Obrigatório pro JPA

    // CONSTRUTOR QUE FALTAVA:
    public Course(String title, String fromLanguage) {
        this.title = title;
        this.fromLanguage = fromLanguage;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public List<Unit> getUnits() { return units; }
}