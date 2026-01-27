package com.duolingo.clone.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int orderIndex;
    private String color;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;

    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL)
    private List<Lesson> lessons = new ArrayList<>();

    public Unit() {}

    // CONSTRUTOR QUE FALTAVA:
    public Unit(String title, int orderIndex, String color, Course course) {
        this.title = title;
        this.orderIndex = orderIndex;
        this.color = color;
        this.course = course;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public int getOrderIndex() { return orderIndex; }
    public String getColor() { return color; }
    public List<Lesson> getLessons() { return lessons; }
}