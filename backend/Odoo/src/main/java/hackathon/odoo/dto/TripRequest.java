package hackathon.odoo.dto;
import lombok.Data;
@Data
public class TripRequest {
    private Long vehicleId;
    private Long driverId;
    private String source;
    private String destination;
    private int cargoWeight;
    private int plannedDistance;
}
