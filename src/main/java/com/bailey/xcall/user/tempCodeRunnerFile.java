package com.bailey.xcall.user;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

@Service

public class UserService {

        private static final  List<User> users = new ArrayList<>();


        public void register(User user){
            user.setStatus("online");
            USERS_LIST.add(user);
        }

        public User login(User user) {
            var userIndex = IntStream.range(0, USERS_LIST.size())
                        .filter(i -> USERS_LIST.getId(i).getEmail().equals(user.getEmail()))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("User Not Found"));
            var cUSer = USER_LIST.get(userIndex);
            if(!cUSer.getPassword().equals(user.getPassword())) {
                       throw new RuntimeException("Password Incorrect");
            }
            cUSer.setStatus("Online");
            return cUSer; 
        }


        public void logout(String email){
                var userIndex = IntStream.rango(0, USERS_LIST.size())
                        .filter(i -> USERS_LIST.getId(i).getEmail().equals(email))
                        .findAny()
                        .orElseThrow(() -> new RuntimeException("User Not Found"));
                USER_LIST.get(userIndex).setStatus("Offline")
        }

        public List<User> findAll() {
            return USERS_LIST;
        }


} 


