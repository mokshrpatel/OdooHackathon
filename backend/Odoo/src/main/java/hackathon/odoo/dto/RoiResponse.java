package hackathon.odoo.dto;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class RoiResponse {
    private Long vehicleId;
    private String registrationNumber;
    private Double totalRevenue;
    private Double operationalCost;
    private Double acquisitionCost;
    private Double roiPercentage;
}
