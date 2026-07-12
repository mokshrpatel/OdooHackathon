package hackathon.odoo.dto;
import hackathon.odoo.enums.TripStatus;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class TripResponse {
    private Long id;
    private Long vehicleId;
    private Long driverId;
    private String source;
    private String destination;
    private int cargoWeight;
    private int plannedDistance;
    private TripStatus status;
}
