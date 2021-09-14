package ru.geekbrains.april.market.services;

import org.junit.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import ru.geekbrains.april.market.models.Product;

import java.math.BigDecimal;
import java.util.Optional;

@SpringBootTest
public class CartServiceTest {
    @Autowired
    private CartService cartService;

    @MockBean
    private ProductService productService;

    private Product product;

    /*@After
    public void afterTests(){
        cartService.dropCart("april_cart_testCartId");
    }*/

    @Test
    public void addToCartTest() {
        cartService.dropCart("april_cart_testCartId");
        product = new Product();
        product.setId(1050L);
        product.setTitle("Carrot");
        product.setPrice(new BigDecimal(70000));
        Mockito.doReturn(Optional.of(product)).when(productService).findById(1050L);
        cartService.addToCart("testCartId", 1050L);
        Mockito.verify(productService, Mockito.times(1)).findById(ArgumentMatchers.eq(1050L));
        cartService.dropCart("april_cart_testCartId");

    }

}
