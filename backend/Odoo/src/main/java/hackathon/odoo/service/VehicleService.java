package hackathon.odoo.service;
import hackathon.odoo.dto.VehicleDto;
import hackathon.odoo.entity.Vehicle;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    public List<VehicleDto> getAllVehicles() {
        return vehicleRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public List<VehicleDto> getAvailableVehicles() {
        return vehicleRepository.findAll().stream()
                .filter(v -> v.getVehicleStatus() == VehicleStatus.AVAILABLE)
                .map(this::mapToDto).collect(Collectors.toList());
    }
    public VehicleDto registerVehicle(VehicleDto request) {
        Vehicle v = Vehicle.builder()
                .registrationNumber(request.getRegistrationNumber())
                .model(request.getNameModel())
                .vehicleType(request.getType())
                .maxLoadCapacity(request.getMaxLoadCapacity().intValue())
                .odometer(request.getOdometer())
                .acquisition_cost(request.getAcquisitionCost())
                .vehicleStatus(VehicleStatus.AVAILABLE)
                .build();
        v = vehicleRepository.save(v);
        return mapToDto(v);
    }
    private VehicleDto mapToDto(Vehicle v) {
        VehicleDto dto = new VehicleDto();
        dto.setId(v.getId());
        dto.setRegistrationNumber(v.getRegistrationNumber());
        dto.setNameModel(v.getModel());
        dto.setType(v.getVehicleType());
        dto.setMaxLoadCapacity((double) v.getMaxLoadCapacity());
        dto.setOdometer(v.getOdometer());
        dto.setAcquisitionCost(v.getAcquisition_cost());
        dto.setStatus(v.getVehicleStatus());
        return dto;
    }
}
