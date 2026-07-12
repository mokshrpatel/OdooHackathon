package hackathon.odoo.dto;
import lombok.Data;
@Data
public class TripCompleteRequest {
    private Double finalOdometer;
    private Double fuelConsumed;
    private Double revenue;
}
