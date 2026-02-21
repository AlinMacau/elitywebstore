package com.elitywebstore.service;

import com.elitywebstore.entities.Category;
import com.elitywebstore.model.response.CategoryResponseDto;
import com.elitywebstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryResponseDto.class))
                .collect(Collectors.toList());
    }
}