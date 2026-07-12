package hackathon.odoo.dto;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class KpiResponse {
    private long activeVehicles;
    private long availableVehicles;
    private long vehiclesInMaintenance;
    private long activeTrips;
    private long pendingTrips;
    private long driversOnDuty;
    private double fleetUtilizationPercentage;
}
