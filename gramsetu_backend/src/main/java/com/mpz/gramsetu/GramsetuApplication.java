package com.mpz.gramsetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GramsetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(GramsetuApplication.class, args);
    }
}



