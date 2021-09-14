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
    private String name;
    private String surname;

    public UserDto(String username, String email, String name, String surname) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.surname = surname;
    }
}
