package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Igrac {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String imeIgraca;

    private String position;
    private Integer age;

    @ManyToOne
    @JoinColumn(name = "tim_id", nullable = false)
    @JsonIgnoreProperties("igraci")  // sprečava vraćanje tima → igrači → tim (beskonačna petlja)
    private Tim tim;

    // Getteri i setteri
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getImeIgraca() { return imeIgraca; }
    public void setImeIgraca(String imeIgraca) { this.imeIgraca = imeIgraca; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Tim getTim() { return tim; }
    public void setTim(Tim tim) { this.tim = tim; }
}
