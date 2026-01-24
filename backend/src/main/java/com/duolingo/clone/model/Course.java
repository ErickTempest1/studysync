package com.duolingo.clone.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // Ex: Inglês Básico
    private String sourceLang;  // Ex: PT-BR
    private String targetLang;  // Ex: EN-US

    // Um curso tem várias unidades
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Unit> units;
}