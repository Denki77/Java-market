package ru.geekbrains.april.market.dtos;

import lombok.Data;

import java.util.UUID;

@Data
public class JwtRequest {
    private String username;
    private String password;
    private String token;
}

// {
//    "username": "Bob",
//    "password": "100"
// }