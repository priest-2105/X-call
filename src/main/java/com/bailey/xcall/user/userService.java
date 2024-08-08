package com.bailey.xcall.user;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final List<User> USERS_LIST = new ArrayList<>();  // Changed to match other references

    public void register(User user) {
        user.setStatus("online");
        USERS_LIST.add(user);  // Corrected to match the variable name
    }

    public User login(User user) {
        int userIndex = IntStream.range(0, USERS_LIST.size())
                .filter(i -> USERS_LIST.get(i).getEmail().equals(user.getEmail()))  // Fixed method call
                .findFirst()  // Changed findAny() to findFirst() to get the first match
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        
        User cUser = USERS_LIST.get(userIndex);  // Fixed the variable name and method call
        if (!cUser.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Password Incorrect");
        }
        cUser.setStatus("Online");
        return cUser;
    }

    public void logout(String email) {
        int userIndex = IntStream.range(0, USERS_LIST.size())
                .filter(i -> USERS_LIST.get(i).getEmail().equals(email))  // Fixed method call
                .findFirst()  // Changed findAny() to findFirst() to get the first match
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        USERS_LIST.get(userIndex).setStatus("Offline");  // Corrected to match the variable name
    }

    public List<User> findAll() {
        return USERS_LIST;
    }
}
