package hackathon.odoo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private Long id;
    private String status;
}
