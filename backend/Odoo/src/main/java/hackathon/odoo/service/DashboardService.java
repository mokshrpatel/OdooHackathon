package hackathon.odoo.service;
import hackathon.odoo.dto.KpiResponse;
import hackathon.odoo.dto.RoiResponse;
import hackathon.odoo.enums.TripStatus;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.repository.DriverRepository;
import hackathon.odoo.repository.TripRepository;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class DashboardService {
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    public KpiResponse getKpis() {
        long totalVehicles = vehicleRepository.count();
        long availableVehicles = vehicleRepository.findAll().stream().filter(v -> v.getVehicleStatus() == VehicleStatus.AVAILABLE).count();
        long inMaintenance = vehicleRepository.findAll().stream().filter(v -> v.getVehicleStatus() == VehicleStatus.MAINTENANCE).count();
        long activeTrips = tripRepository.findAll().stream().filter(t -> t.getTripStatus() == TripStatus.DISPATCHED).count();
        long pendingTrips = tripRepository.findAll().stream().filter(t -> t.getTripStatus() == TripStatus.DRAFT).count();
        long driversOnDuty = driverRepository.findAll().stream().filter(d -> d.getDriverStatus() == hackathon.odoo.enums.DriverStatus.ONTRIP).count();
        double utilization = totalVehicles == 0 ? 0 : (double) (totalVehicles - availableVehicles) / totalVehicles * 100;
        return KpiResponse.builder()
                .activeVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesInMaintenance(inMaintenance)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .fleetUtilizationPercentage(utilization)
                .build();
    }
    public List<RoiResponse> getRoi() {
        return vehicleRepository.findAll().stream().map(v -> {
            // Stub calculations
            double revenue = 15000.0;
            double cost = 2500.0;
            double roi = v.getAcquisition_cost() == 0 ? 0 : ((revenue - cost) / v.getAcquisition_cost()) * 100;
            return RoiResponse.builder()
                    .vehicleId(v.getId())
                    .registrationNumber(v.getRegistrationNumber())
                    .totalRevenue(revenue)
                    .operationalCost(cost)
                    .acquisitionCost(v.getAcquisition_cost())
                    .roiPercentage(roi)
                    .build();
        }).collect(Collectors.toList());
    }
}
