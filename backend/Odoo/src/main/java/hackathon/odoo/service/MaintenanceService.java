package hackathon.odoo.service;
import hackathon.odoo.dto.MaintenanceRequest;
import hackathon.odoo.dto.MaintenanceResponse;
import hackathon.odoo.dto.MessageResponse;
import hackathon.odoo.entity.Maintenance;
import hackathon.odoo.entity.Vehicle;
import hackathon.odoo.enums.MaintenanceStatus;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.repository.MaintenanceRepository;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;
    public java.util.List<MaintenanceResponse> getAllMaintenances() {
        return maintenanceRepository.findAll().stream().map(m -> MaintenanceResponse.builder()
                .id(m.getId())
                .vehicleId(m.getVehicle().getId())
                .description(m.getDescription())
                .cost(m.getCost())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .build()).collect(java.util.stream.Collectors.toList());
    }
    public MaintenanceResponse createMaintenance(MaintenanceRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        v.setVehicleStatus(VehicleStatus.MAINTENANCE);
        Maintenance m = Maintenance.builder()
                .vehicle(v)
                .description(request.getDescription())
                .cost(request.getCost())
                .status(MaintenanceStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
        m = maintenanceRepository.save(m);
        return MaintenanceResponse.builder()
                .id(m.getId())
                .vehicleId(v.getId())
                .description(m.getDescription())
                .cost(m.getCost())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .build();
    }
    public MessageResponse closeMaintenance(Long id) {
        Maintenance m = maintenanceRepository.findById(id).orElseThrow();
        m.setStatus(MaintenanceStatus.CLOSED);
        m.getVehicle().setVehicleStatus(VehicleStatus.AVAILABLE);
        maintenanceRepository.save(m);
        return new MessageResponse("Maintenance log closed. Vehicle is now Available.", m.getId(), "Closed");
    }
}
