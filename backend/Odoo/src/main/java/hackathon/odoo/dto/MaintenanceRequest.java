package hackathon.odoo.dto;
import lombok.Data;
@Data
public class MaintenanceRequest {
    private Long vehicleId;
    private String description;
    private Double cost;
}
