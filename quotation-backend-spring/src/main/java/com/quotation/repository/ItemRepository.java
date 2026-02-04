package com.quotation.repository;

import com.quotation.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    List<Item> findByIsActiveTrueOrderByNameAsc();
    
    List<Item> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    @Query("SELECT i FROM Item i WHERE i.isActive = true AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Item> searchItems(@Param("search") String search);
    
    @Query("SELECT i FROM Item i WHERE i.isActive = true AND " +
           "i.category.id = :categoryId AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Item> searchItemsByCategory(@Param("search") String search, 
                                     @Param("categoryId") Long categoryId);
    
    List<Item> findByNameContainingIgnoreCase(String name);
    
    List<Item> findByCategoryId(Long categoryId);
    
    List<Item> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId);
}
