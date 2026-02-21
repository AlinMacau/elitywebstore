package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.response.CategoryResponseDto;
import com.elitywebstore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_API_V1 + "/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponseDto> getAllCategories() {
        return categoryService.getAllCategories();
    }
}