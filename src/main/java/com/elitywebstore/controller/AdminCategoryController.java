package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.CategoryRequestDto;
import com.elitywebstore.model.request.CategoryUpdateRequestDto;
import com.elitywebstore.model.response.CategoryResponseDto;
import com.elitywebstore.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.ADMIN_CATEGORIES)
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponseDto> getAllCategories() {
        log.info("Admin: Getting all categories");
        return categoryService.getAllCategoriesForAdmin();
    }

    @GetMapping("/{id}")
    public CategoryResponseDto getCategoryById(@PathVariable Long id) {
        log.info("Admin: Getting category by id: {}", id);
        return categoryService.getCategoryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponseDto createCategory(@Valid @RequestBody CategoryRequestDto request) {
        log.info("Admin: Creating new category: {}", request.getName());
        return categoryService.createCategory(request);
    }

    @PutMapping
    public CategoryResponseDto updateCategory(@Valid @RequestBody CategoryUpdateRequestDto request) {
        log.info("Admin: Updating category: {}", request.getId());
        return categoryService.updateCategory(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        log.info("Admin: Deleting category: {}", id);
        categoryService.deleteCategory(id);
    }

    @PutMapping("/{id}/reactivate")
    public CategoryResponseDto reactivateCategory(@PathVariable Long id) {
        log.info("Admin: Reactivating category: {}", id);
        return categoryService.reactivateCategory(id);
    }
}