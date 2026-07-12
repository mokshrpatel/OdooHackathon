package hackathon.odoo.service;

import hackathon.odoo.dto.LoginRequest;
import hackathon.odoo.dto.LoginResponse;

import hackathon.odoo.dto.RegisterRequest;

public interface AuthService {
    LoginResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
