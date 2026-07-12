package hackathon.odoo;

import hackathon.odoo.config.SecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class OdooApplication {

    public static void main(String[] args) {
        SpringApplication.run(OdooApplication.class, args);

    }
}
