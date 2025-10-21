package com.elitywebstore.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationCustomBeans {

    @Bean
    public ModelMapper createModelmapperInstance(){
        return new ModelMapper();
    }
}
