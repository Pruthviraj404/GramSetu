package com.mpz.gramsetu.service;


import com.mpz.gramsetu.entity.AreaNames;
import com.mpz.gramsetu.repository.AreaNamesRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class AreaNamesService {
    private final AreaNamesRepository areaNamesRepository;


    public List<AreaNames>getALLAreas(){
        return areaNamesRepository.findAll();
    }
    
}
