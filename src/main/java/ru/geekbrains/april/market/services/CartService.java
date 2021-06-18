package ru.geekbrains.april.market.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import ru.geekbrains.april.market.error_handling.ResourceNotFoundException;
import ru.geekbrains.april.market.models.Product;
import ru.geekbrains.april.market.utils.Cart;

@Service
@RequiredArgsConstructor
public class CartService {
    private final ProductService productService;
    private final RedisTemplate<String, Object> redisTemplate;

    public void addToCart(String cartId, Long productId) {
        Cart cart = getCurrentCart(cartId);
        if (cart.addToCart(productId)) {
            save(cartId, cart);
            return;
        }
        Product product = productService.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product with id " + productId + " is missed. (Add to cart)"));
        cart.addToCart(product);
        save(cartId, cart);
    }

    public void decrementProduct(String cartId, Long productId) {
        Cart cart = getCurrentCart(cartId);
        cart.decrementProduct(productId);
        save(cartId, cart);
    }

    public boolean isCartExists(String cartId) {
        return redisTemplate.hasKey("april_cart_" + cartId);
    }

    public Cart getCurrentCart(String cartId) {
        if (!redisTemplate.hasKey("april_cart_" + cartId)) {
            redisTemplate.opsForValue().set("april_cart_" + cartId, new Cart());
        }
        Cart cart = (Cart) redisTemplate.opsForValue().get("april_cart_" + cartId);
        return cart;
    }

    public void save(String cartId, Cart cart) {
        redisTemplate.opsForValue().set("april_cart_" + cartId, cart);
    }

    public void clearCart(String cartId) {
        Cart cart = getCurrentCart(cartId);
        cart.clear();
        save(cartId, cart);
    }

    public void merge(String userCartId, String guestCartId) {
        Cart userCart = getCurrentCart(userCartId);
        Cart guestCart = getCurrentCart(guestCartId);
        userCart.merge(guestCart);
        save(userCartId, userCart);
        save(guestCartId, guestCart);
    }
}
