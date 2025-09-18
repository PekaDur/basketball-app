package com.example.demo.repository;

import com.example.demo.entity.Tim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimRepository extends JpaRepository<Tim, Integer> {}