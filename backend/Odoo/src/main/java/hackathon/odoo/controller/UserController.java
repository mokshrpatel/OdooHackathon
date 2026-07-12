package hackathon.odoo.controller;
import hackathon.odoo.dto.UserCreateRequest;
import hackathon.odoo.dto.UserResponse;
import hackathon.odoo.entity.AppUser;
import hackathon.odoo.entity.Role;
import hackathon.odoo.repository.AppUserRepository;
import hackathon.odoo.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        Role role = roleRepository.findById(request.getRoleId()).orElseThrow();
        AppUser user = AppUser.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .fname("User")
                .lname("User")
                .build();
        user = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(role.getRole().name())
                .build());
    }
}
