package com.mpz.gramsetu.controller;
import com.mpz.gramsetu.entity.AreaNames;
import com.mpz.gramsetu.service.AreaNamesService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/areas")
@AllArgsConstructor

public class AreaNamesController {

    private final AreaNamesService areaNamesService;

    @GetMapping
    public List<AreaNames>getALLAreas(){
        return areaNamesService.getALLAreas();
    }
    
}
