package com.bailey.xcall;

import lombok.Builder;
import lombok.Data;


@Data
@Builder


public class User {

    private String username;
    private String email;
    private String password;
    private String status;

}