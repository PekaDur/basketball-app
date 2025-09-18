package com.example.demo.controller;

import com.example.demo.entity.Igrac;
import com.example.demo.repository.IgracRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/igraci")
public class IgracController {

    private final IgracRepository igracRepository;

    public IgracController(IgracRepository igracRepository) {
        this.igracRepository = igracRepository;
    }

    @GetMapping
    public List<Igrac> getAll() {
        return igracRepository.findAll();
    }

    @PostMapping
    public Igrac create(@RequestBody Igrac igrac) {
        return igracRepository.save(igrac);
    }

    @PutMapping("/{id}")
    public Igrac update(@PathVariable Integer id, @RequestBody Igrac igracDetails) {
        Igrac igrac = igracRepository.findById(id).orElseThrow();
        igrac.setImeIgraca(igracDetails.getImeIgraca());
        igrac.setPosition(igracDetails.getPosition());
        igrac.setAge(igracDetails.getAge());
        igrac.setTim(igracDetails.getTim());
        return igracRepository.save(igrac);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        igracRepository.deleteById(id);
    }
}
