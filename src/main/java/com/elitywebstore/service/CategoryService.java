package com.elitywebstore.service;

import com.elitywebstore.entities.Category;
import com.elitywebstore.model.request.CategoryRequestDto;
import com.elitywebstore.model.request.CategoryUpdateRequestDto;
import com.elitywebstore.model.response.CategoryResponseDto;
import com.elitywebstore.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ==================== PUBLIC METHODS ====================

    public List<CategoryResponseDto> getAllCategories() {
        log.info("Getting all active categories");
        return categoryRepository.findAll().stream()
                .filter(c -> c.getActive() == null || c.getActive())
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryResponseDto getCategoryById(Long id) {
        log.info("Getting category by id: {}", id);
        Category category = getById(id);
        return convertToDto(category);
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
    }

    // ==================== ADMIN METHODS ====================

    public List<CategoryResponseDto> getAllCategoriesForAdmin() {
        log.info("Getting all categories for admin (including inactive)");
        return categoryRepository.findAll().stream()
                .map(this::convertToDtoWithStatus)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto request) {
        log.info("Creating new category: {}", request.getName());

        // Check if category name already exists
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with id: {}", savedCategory.getId());

        return convertToDtoWithStatus(savedCategory);
    }

    @Transactional
    public CategoryResponseDto updateCategory(CategoryUpdateRequestDto request) {
        log.info("Updating category with id: {}", request.getId());

        Category category = getById(request.getId());

        // Check if new name conflicts with existing category
        if (request.getName() != null && !request.getName().equals(category.getName())) {
            categoryRepository.findByName(request.getName()).ifPresent(existing -> {
                if (!existing.getId().equals(request.getId())) {
                    throw new RuntimeException("Category with name '" + request.getName() + "' already exists");
                }
            });
            category.setName(request.getName());
        }

        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully: {}", updatedCategory.getId());

        return convertToDtoWithStatus(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category with id: {}", id);

        Category category = getById(id);

        // Check if category has products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            // Count only active products
            long activeProductCount = category.getProducts().stream()
                    .filter(p -> p.getActive() == null || p.getActive())
                    .count();

            if (activeProductCount > 0) {
                // Soft delete - mark as inactive
                log.info("Category {} has {} active products, performing soft delete", id, activeProductCount);
                category.setActive(false);
                categoryRepository.save(category);
                log.info("Category soft deleted (deactivated) successfully: {}", id);
            } else {
                // All products are inactive, safe to soft delete
                log.info("Category {} has only inactive products, performing soft delete", id);
                category.setActive(false);
                categoryRepository.save(category);
                log.info("Category soft deleted successfully: {}", id);
            }
        } else {
            // Hard delete - no products reference this category
            log.info("Category {} has no products, performing hard delete", id);
            categoryRepository.delete(category);
            log.info("Category hard deleted successfully: {}", id);
        }
    }

    @Transactional
    public CategoryResponseDto reactivateCategory(Long id) {
        log.info("Reactivating category with id: {}", id);

        Category category = getById(id);

        if (category.getActive() == null || category.getActive()) {
            log.warn("Category {} is already active", id);
            throw new RuntimeException("Category is already active");
        }

        category.setActive(true);
        Category savedCategory = categoryRepository.save(category);

        log.info("Category reactivated successfully: {}", id);
        return convertToDtoWithStatus(savedCategory);
    }

    // ==================== HELPER METHODS ====================

    private CategoryResponseDto convertToDto(Category category) {
        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());

        // Count only active products
        if (category.getProducts() != null) {
            int activeProductCount = (int) category.getProducts().stream()
                    .filter(p -> p.getActive() == null || p.getActive())
                    .count();
            dto.setProductCount(activeProductCount);
        } else {
            dto.setProductCount(0);
        }

        return dto;
    }

    private CategoryResponseDto convertToDtoWithStatus(Category category) {
        CategoryResponseDto dto = convertToDto(category);
        dto.setActive(category.getActive() == null ? true : category.getActive());
        return dto;
    }
}