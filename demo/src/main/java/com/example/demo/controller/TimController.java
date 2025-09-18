package com.example.demo.controller;

import com.example.demo.entity.Tim;
import com.example.demo.repository.TimRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timovi")
public class TimController {

    private final TimRepository timRepository;

    public TimController(TimRepository timRepository) {
        this.timRepository = timRepository;
    }

    @GetMapping
    public List<Tim> getAll() {
        return timRepository.findAll();
    }

    @PostMapping
    public Tim create(@RequestBody Tim tim) {
        return timRepository.save(tim);
    }

    @PutMapping("/{id}")
    public Tim update(@PathVariable Integer id, @RequestBody Tim timDetails) {
        Tim tim = timRepository.findById(id).orElseThrow();
        tim.setNazivTima(timDetails.getNazivTima());
        tim.setGradTima(timDetails.getGradTima());
        tim.setGodinaOsnivanja(timDetails.getGodinaOsnivanja());
        return timRepository.save(tim);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        timRepository.deleteById(id);
    }
}