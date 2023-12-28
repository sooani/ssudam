package com.codestates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class IsRottenApplication {

	public static void main(String[] args) {
		SpringApplication.run(IsRottenApplication.class, args);
	}

}
