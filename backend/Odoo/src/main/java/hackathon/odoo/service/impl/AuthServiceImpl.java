package hackathon.odoo.service.impl;

import hackathon.odoo.dto.AppUserResponse;
import hackathon.odoo.dto.LoginRequest;
import hackathon.odoo.dto.LoginResponse;
import hackathon.odoo.dto.RegisterRequest;
import hackathon.odoo.entity.AppUser;
import hackathon.odoo.entity.Role;
import hackathon.odoo.repository.AppUserRepository;
import hackathon.odoo.repository.RoleRepository;
import hackathon.odoo.security.JwtService;
import hackathon.odoo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponse register(RegisterRequest request) {
        // Fetch the role from DB, or create it if you want to handle it that way.
        // Assuming roles are pre-populated.
        Role role = roleRepository.findByRole(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        AppUser user = AppUser.builder()
                .fname(request.getFname())
                .lname(request.getLname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        AppUser savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);

        return LoginResponse.builder()
                .token(jwtToken)
                .user(AppUserResponse.builder()
                        .id(savedUser.getId())
                        .email(savedUser.getEmail())
                        .fname(savedUser.getFname())
                        .lname(savedUser.getLname())
                        .role(savedUser.getRole().getRole())
                        .build())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(jwtToken)
                .user(AppUserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fname(user.getFname())
                        .lname(user.getLname())
                        .role(user.getRole().getRole())
                        .build())
                .build();
    }
}
