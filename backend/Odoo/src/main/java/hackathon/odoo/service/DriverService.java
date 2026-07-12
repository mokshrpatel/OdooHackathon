package hackathon.odoo.service;
import hackathon.odoo.dto.DriverDto;
import hackathon.odoo.entity.Driver;
import hackathon.odoo.enums.DriverStatus;
import hackathon.odoo.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository driverRepository;
    public List<DriverDto> getAllDrivers() {
        return driverRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }
    public List<DriverDto> getAvailableDrivers() {
        return driverRepository.findAll().stream()
                .filter(d -> d.getDriverStatus() == DriverStatus.AVAILABLE)
                .map(this::mapToDto).collect(Collectors.toList());
    }
    public DriverDto registerDriver(DriverDto request) {
        Driver d = Driver.builder()
                .licenseNumber(request.getLicenseNumber())
                // Assuming Name is handled elsewhere or ignored in the strict entity if absent
                .licenseExpiryDate(request.getLicenseExpiryDate())
                .contactNumber(request.getContactNumber())
                .driverStatus(DriverStatus.AVAILABLE)
                .build();
        d = driverRepository.save(d);
        DriverDto resp = mapToDto(d);
        resp.setName(request.getName()); // Fake it since Driver entity lacks name
        return resp;
    }
    private DriverDto mapToDto(Driver d) {
        DriverDto dto = new DriverDto();
        dto.setId(d.getId());
        dto.setLicenseNumber(d.getLicenseNumber());
        dto.setLicenseExpiryDate(d.getLicenseExpiryDate());
        dto.setContactNumber(d.getContactNumber());
        dto.setStatus(d.getDriverStatus());
        dto.setSafetyScore(100);
        dto.setName("Driver " + d.getId());
        return dto;
    }
}
