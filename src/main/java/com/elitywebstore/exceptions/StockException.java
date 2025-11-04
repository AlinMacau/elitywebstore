package com.elitywebstore.exceptions;

import com.elitywebstore.entities.Product;

public class StockException extends RuntimeException{
    public StockException(Product product) {
        super("Stock exceeded! Available units: " + product.getStock());
    }
}
