package hackathon.odoo.config;

import hackathon.odoo.entity.AppUser;
import hackathon.odoo.entity.Role;
import hackathon.odoo.enums.Roles;
import hackathon.odoo.repository.AppUserRepository;
import hackathon.odoo.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        seedRole(1, Roles.FLEETMANAGER);
        seedRole(2, Roles.DISPATCHER);
        seedRole(3, Roles.SAFETYOFFICER);
        seedRole(4, Roles.DRIVER);

        // Seed Admin User
        String adminEmail = "admin@gmail.com";
        Optional<AppUser> adminOpt = appUserRepository.findByEmail(adminEmail);
        
        if (adminOpt.isEmpty()) {
            Role fleetManagerRole = roleRepository.findByRole(Roles.FLEETMANAGER)
                    .orElseThrow(() -> new RuntimeException("Fleet Manager role not found"));
            
            AppUser admin = AppUser.builder()
                    .fname("Taksh")
                    .lname("Shrimali")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(fleetManagerRole)
                    .build();
            
            appUserRepository.save(admin);
            System.out.println("Seeded default admin user: " + adminEmail);
        } else {
            System.out.println("Admin user already exists.");
        }
    }

    private void seedRole(int id, Roles roleEnum) {
        Optional<Role> roleOpt = roleRepository.findByRole(roleEnum);
        if (roleOpt.isEmpty()) {
            Role role = new Role(id, roleEnum);
            roleRepository.save(role);
            System.out.println("Seeded role: " + roleEnum.name());
        }
    }
}
