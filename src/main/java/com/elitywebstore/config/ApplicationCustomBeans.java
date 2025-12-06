package com.elitywebstore.config;

import com.elitywebstore.entities.User;
import com.elitywebstore.model.response.UserResponseDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationCustomBeans {

    @Bean
    public ModelMapper createModelmapperInstance(){

        ModelMapper mapper = new ModelMapper();

        mapper.addMappings((new PropertyMap<User, UserResponseDto>() {

            @Override
            protected void configure() {
                map(source.getDetails().getFirstName(), destination.getFirstName());
                map(source.getDetails().getLastName(), destination.getLastname());
                map(source.getDetails().getPhoneNumber(), destination.getPhoneNumber());
            }
        }));

        return mapper;
    }

    @Bean
    public RestTemplate createRestTemplateInstance(){
        return new RestTemplate();
    }
}
