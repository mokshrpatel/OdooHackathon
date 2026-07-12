package hackathon.odoo.dto;
import hackathon.odoo.enums.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder
public class MaintenanceResponse {
    private Long id;
    private Long vehicleId;
    private String description;
    private Double cost;
    private MaintenanceStatus status;
    private LocalDateTime createdAt;
}
