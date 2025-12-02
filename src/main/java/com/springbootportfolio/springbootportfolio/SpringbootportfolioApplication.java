package com.springbootportfolio.springbootportfolio;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@MapperScan("com.springbootportfolio.springbootportfolio.mapper") 
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class SpringbootportfolioApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringbootportfolioApplication.class, args);
	}

}
