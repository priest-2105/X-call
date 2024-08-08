package com.bailey.xcall;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.bailey.xcall.user.UserService;
import com.bailey.xcall.user.User;

@SpringBootApplication
public class XcallApplication {

    public static void main(String[] args) {
        SpringApplication.run(XcallApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(UserService service) {
        return args -> {
			service.register(User.builder()
			.username("john_doe")
			.email("john.doe@example.com")
			.password("password123")
			.build());
	
	// service.register(User.builder()
	// 		.username("jane_smith")
	// 		.email("jane.smith@example.com")
	// 		.password("securepass")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("michael_brown")
	// 		.email("michael.brown@example.com")
	// 		.password("pass2024")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("emily_white")
	// 		.email("emily.white@example.com")
	// 		.password("mypassword")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("chris_jones")
	// 		.email("chris.jones@example.com")
	// 		.password("letmein")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("sarah_green")
	// 		.email("sarah.green@example.com")
	// 		.password("greenpass")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("david_wilson")
	// 		.email("david.wilson@example.com")
	// 		.password("dav123")
	// 		.build());
	
	// service.register(User.builder()
	// 		.username("laura_adams")
	// 		.email("laura.adams@example.com")
	// 		.password("adams2024")
	// 		.build());
	
	service.register(User.builder()
			.username("james_clark")
			.email("james.clark@example.com")
			.password("clarkkey")
			.build());
	
	service.register(User.builder()
			.username("olivia_johnson")
			.email("olivia.johnson@example.com")
			.password("johnson_olivia")
			.build());
	
        };
    }
}
