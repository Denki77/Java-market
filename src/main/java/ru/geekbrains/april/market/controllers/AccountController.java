package ru.geekbrains.april.market.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.geekbrains.april.market.dtos.JwtRequest;
import ru.geekbrains.april.market.dtos.JwtResponse;
import ru.geekbrains.april.market.dtos.UserDto;
import ru.geekbrains.april.market.error_handling.MarketError;
import ru.geekbrains.april.market.error_handling.ResourceNotFoundException;
import ru.geekbrains.april.market.models.Role;
import ru.geekbrains.april.market.models.User;
import ru.geekbrains.april.market.repositories.RoleRepository;
import ru.geekbrains.april.market.services.UserService;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/account")
@RequiredArgsConstructor
public class AccountController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @GetMapping
    public UserDto getCurrentUsername(Principal principal) {
        User currentUser = userService.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User doesn't exist"));
        return new UserDto(currentUser.getUsername(), currentUser.getEmail(), currentUser.getName(), currentUser.getSurname());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.ok(new MarketError(403, "Такой юзер существует!!!"));
        }

        if (user.getEmail() == null) {
            return ResponseEntity.ok(new MarketError(404, "Email is required"));
        }

        Role role = roleRepository.findRoleByName("ROLE_USER").get();
        Collection<Role> rolesList = Arrays.asList(role);

        user.setRoles(rolesList);

        user.setPassword(passwordEncoder.encode(user.getPassword())); // encode email to bcrypt
        System.out.println(user);
        user = userService.save(user);

        return ResponseEntity.ok(new MarketError(200, ""));
    }
}
