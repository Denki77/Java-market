package ru.geekbrains.april.market.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.geekbrains.april.market.dtos.OrderItemDto;
import ru.geekbrains.april.market.dtos.ProductDto;
import ru.geekbrains.april.market.error_handling.ResourceNotFoundException;
import ru.geekbrains.april.market.models.*;
import ru.geekbrains.april.market.repositories.OrderRepository;
import ru.geekbrains.april.market.repositories.ProductRepository;
import ru.geekbrains.april.market.utils.Cart;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final CartService cartService;

    public List<Order> findAllByUser(User user) {
        return orderRepository.findAllByUser(user);
    }

    public Order createOrderForCurrentUser(User user) {
        Order order = new Order();
        order.setUser(user);
        Cart cart = cartService.getCurrentCart(user.getUsername());
        order.setPrice(cart.getSum());
        // todo распутать этот кусок
        order.setItems(new ArrayList<>());
        for (OrderItemDto o : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            order.getItems().add(orderItem);
            orderItem.setOrder(order);
            orderItem.setQuantity(o.getQuantity());
            orderItem.setPricePerProduct(o.getPricePerProduct());
            orderItem.setPrice(o.getPrice());
            orderItem.setProduct(productService.findById(o.getProductId()).get());
        }
        order = orderRepository.save(order);
        cart.clear();
        cartService.save(user.getUsername(), cart);
        return order;
    }
}
