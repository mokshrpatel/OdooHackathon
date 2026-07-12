package hackathon.odoo.dto;
import lombok.Data;
@Data
public class UserCreateRequest {
    private String email;
    private String password;
    private int roleId;
}
