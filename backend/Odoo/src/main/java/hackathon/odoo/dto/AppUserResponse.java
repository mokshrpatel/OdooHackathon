package hackathon.odoo.dto;

import hackathon.odoo.enums.Roles;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppUserResponse {
    Long id;
    String email;
    String fname;
    String lname;
    Roles role;
}
