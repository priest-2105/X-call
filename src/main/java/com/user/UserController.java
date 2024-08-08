package com.bailey.xcall;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;



@RestController
@RequestMapping
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j


public class UserController {

    private final UserService service;



        @PostMapping
        public void register(User user){
            service.register(user);
        }

        @PostMapping("/login")
        public User login(User user) {
         register service.login(user);
        }

        @PostMapping("/logout")
        public void logout(String email){
         return service.logout(email);
             
              }


        @GetMapping
        public List<User> findAll() {
            return service.findAll();;
        }


} 


