package ru.geekbrains.april.market.dtos;

import lombok.Data;
import ru.geekbrains.april.market.utils.Cart;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class UserDto {
    private String username;
    private String email;

    public UserDto(String username, String email) {
        this.username = username;
        this.email = email;
    }
}
