package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Tim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nazivTima;

    private String gradTima;
    private Integer godinaOsnivanja;

    @OneToMany(mappedBy = "tim", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("tim")  // sprečava vraćanje igrača → tim → igrači (beskonačna petlja)
    private List<Igrac> igraci;

    // Getteri i setteri
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNazivTima() { return nazivTima; }
    public void setNazivTima(String nazivTima) { this.nazivTima = nazivTima; }

    public String getGradTima() { return gradTima; }
    public void setGradTima(String gradTima) { this.gradTima = gradTima; }

    public Integer getGodinaOsnivanja() { return godinaOsnivanja; }
    public void setGodinaOsnivanja(Integer godinaOsnivanja) { this.godinaOsnivanja = godinaOsnivanja; }

    public List<Igrac> getIgraci() { return igraci; }
    public void setIgraci(List<Igrac> igraci) { this.igraci = igraci; }
}
