package hackathon.odoo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    String token;

    AppUserResponse user;

}
