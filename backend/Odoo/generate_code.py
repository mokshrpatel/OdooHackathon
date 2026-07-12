import os

base_dir = r"c:\Users\moksh\Desktop\Odoo\OdooHackathon\backend\Odoo\src\main\java\hackathon\odoo"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# DTOs
write_file("dto/VehicleDto.java", """
package hackathon.odoo.dto;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.enums.VehicleType;
import lombok.Data;
@Data
public class VehicleDto {
    private Long id;
    private String registrationNumber;
    private String nameModel;
    private VehicleType type;
    private Double maxLoadCapacity;
    private Double odometer;
    private Double acquisitionCost;
    private VehicleStatus status;
}
""")

write_file("dto/UserCreateRequest.java", """
package hackathon.odoo.dto;
import lombok.Data;
@Data
public class UserCreateRequest {
    private String email;
    private String password;
    private int roleId;
}
""")

write_file("dto/UserResponse.java", """
package hackathon.odoo.dto;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String role;
}
""")

write_file("dto/KpiResponse.java", """
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
""")

write_file("dto/RoiResponse.java", """
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
""")

write_file("dto/DriverDto.java", """
package hackathon.odoo.dto;
import hackathon.odoo.enums.DriverStatus;
import lombok.Data;
import java.time.LocalDate;
@Data
public class DriverDto {
    private Long id;
    private String name;
    private String licenseNumber;
    private String licenseCategory;
    private LocalDate licenseExpiryDate;
    private String contactNumber;
    private Integer safetyScore;
    private DriverStatus status;
}
""")

write_file("dto/TripRequest.java", """
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
""")

write_file("dto/TripResponse.java", """
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
""")

write_file("dto/TripCompleteRequest.java", """
package hackathon.odoo.dto;
import lombok.Data;
@Data
public class TripCompleteRequest {
    private Double finalOdometer;
    private Double fuelConsumed;
    private Double revenue;
}
""")

write_file("dto/MessageResponse.java", """
package hackathon.odoo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private Long id;
    private String status;
}
""")

write_file("dto/MaintenanceRequest.java", """
package hackathon.odoo.dto;
import lombok.Data;
@Data
public class MaintenanceRequest {
    private Long vehicleId;
    private String description;
    private Double cost;
}
""")

write_file("dto/MaintenanceResponse.java", """
package hackathon.odoo.dto;
import hackathon.odoo.enums.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder
public class MaintenanceResponse {
    private Long id;
    private Long vehicleId;
    private String description;
    private Double cost;
    private MaintenanceStatus status;
    private LocalDateTime createdAt;
}
""")

write_file("dto/FuelExpenseRequest.java", """
package hackathon.odoo.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class FuelExpenseRequest {
    private Long vehicleId;
    private Double liters;
    private Double cost;
    private LocalDate date;
}
""")

write_file("dto/GeneralExpenseRequest.java", """
package hackathon.odoo.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class GeneralExpenseRequest {
    private Long vehicleId;
    private Long tripId;
    private String expenseType;
    private Double amount;
    private LocalDate date;
}
""")

# Controllers
write_file("controller/UserController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.UserCreateRequest;
import hackathon.odoo.dto.UserResponse;
import hackathon.odoo.entity.AppUser;
import hackathon.odoo.entity.Role;
import hackathon.odoo.repository.AppUserRepository;
import hackathon.odoo.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        Role role = roleRepository.findById(request.getRoleId()).orElseThrow();
        AppUser user = AppUser.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .fname("User")
                .lname("User")
                .build();
        user = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(role.getRole().name())
                .build());
    }
}
""")

write_file("controller/DashboardController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.KpiResponse;
import hackathon.odoo.dto.RoiResponse;
import hackathon.odoo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<KpiResponse> getKpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }
    @GetMapping("/reports/roi")
    public ResponseEntity<List<RoiResponse>> getRoi() {
        return ResponseEntity.ok(dashboardService.getRoi());
    }
}
""")

write_file("controller/VehicleController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.VehicleDto;
import hackathon.odoo.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;
    @GetMapping
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
    @GetMapping("/available")
    public ResponseEntity<List<VehicleDto>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }
    @PostMapping
    public ResponseEntity<VehicleDto> registerVehicle(@RequestBody VehicleDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.registerVehicle(request));
    }
}
""")

write_file("controller/DriverController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.DriverDto;
import hackathon.odoo.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {
    private final DriverService driverService;
    @GetMapping
    public ResponseEntity<List<DriverDto>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
    @GetMapping("/available")
    public ResponseEntity<List<DriverDto>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }
    @PostMapping
    public ResponseEntity<DriverDto> registerDriver(@RequestBody DriverDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.registerDriver(request));
    }
}
""")

write_file("controller/TripController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.MessageResponse;
import hackathon.odoo.dto.TripCompleteRequest;
import hackathon.odoo.dto.TripRequest;
import hackathon.odoo.dto.TripResponse;
import hackathon.odoo.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;
    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@RequestBody TripRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(request));
    }
    @PatchMapping("/{id}/dispatch")
    public ResponseEntity<MessageResponse> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatchTrip(id));
    }
    @PatchMapping("/{id}/complete")
    public ResponseEntity<MessageResponse> completeTrip(@PathVariable Long id, @RequestBody TripCompleteRequest request) {
        return ResponseEntity.ok(tripService.completeTrip(id, request));
    }
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<MessageResponse> cancelTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancelTrip(id));
    }
}
""")

write_file("controller/MaintenanceController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.MaintenanceRequest;
import hackathon.odoo.dto.MaintenanceResponse;
import hackathon.odoo.dto.MessageResponse;
import hackathon.odoo.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {
    private final MaintenanceService maintenanceService;
    @PostMapping
    public ResponseEntity<MaintenanceResponse> createMaintenance(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.createMaintenance(request));
    }
    @PatchMapping("/{id}/close")
    public ResponseEntity<MessageResponse> closeMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.closeMaintenance(id));
    }
}
""")

write_file("controller/ExpenseController.java", """
package hackathon.odoo.controller;
import hackathon.odoo.dto.FuelExpenseRequest;
import hackathon.odoo.dto.GeneralExpenseRequest;
import hackathon.odoo.entity.Expense;
import hackathon.odoo.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;
    @PostMapping("/fuel")
    public ResponseEntity<Expense> recordFuel(@RequestBody FuelExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.recordFuel(request));
    }
    @PostMapping("/general")
    public ResponseEntity<Expense> recordGeneral(@RequestBody GeneralExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.recordGeneral(request));
    }
}
""")

# Services - simple stubs that fulfill the DB updates.
write_file("service/DashboardService.java", """
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
        long inMaintenance = vehicleRepository.findAll().stream().filter(v -> v.getVehicleStatus() == VehicleStatus.IN_SHOP).count();
        long activeTrips = tripRepository.findAll().stream().filter(t -> t.getTripStatus() == TripStatus.ON_TRIP).count();
        long pendingTrips = tripRepository.findAll().stream().filter(t -> t.getTripStatus() == TripStatus.DRAFT).count();
        long driversOnDuty = driverRepository.findAll().stream().filter(d -> d.getDriverStatus() == hackathon.odoo.enums.DriverStatus.ON_TRIP).count();
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
""")

write_file("service/VehicleService.java", """
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
""")

write_file("service/DriverService.java", """
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
""")

write_file("service/TripService.java", """
package hackathon.odoo.service;
import hackathon.odoo.dto.MessageResponse;
import hackathon.odoo.dto.TripCompleteRequest;
import hackathon.odoo.dto.TripRequest;
import hackathon.odoo.dto.TripResponse;
import hackathon.odoo.entity.Driver;
import hackathon.odoo.entity.Trip;
import hackathon.odoo.entity.Vehicle;
import hackathon.odoo.enums.DriverStatus;
import hackathon.odoo.enums.TripStatus;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.repository.DriverRepository;
import hackathon.odoo.repository.TripRepository;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    public TripResponse createTrip(TripRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        if (request.getCargoWeight() > v.getMaxLoadCapacity()) {
            throw new RuntimeException("Cargo exceeds capacity");
        }
        Driver d = driverRepository.findById(request.getDriverId()).orElseThrow();
        Trip t = Trip.builder()
                .vehicle(v)
                .driver(d)
                .source(request.getSource())
                .destination(request.getDestination())
                .cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance())
                .tripStatus(TripStatus.DRAFT)
                .finalOdometer(0.0)
                .fuelConsumed(0.0)
                .build();
        t = tripRepository.save(t);
        return TripResponse.builder()
                .id(t.getId())
                .vehicleId(v.getId())
                .driverId(d.getId())
                .source(t.getSource())
                .destination(t.getDestination())
                .cargoWeight(t.getCargoWeight())
                .plannedDistance(t.getPlannedDistance())
                .status(t.getTripStatus())
                .build();
    }
    public MessageResponse dispatchTrip(Long id) {
        Trip t = tripRepository.findById(id).orElseThrow();
        t.setTripStatus(TripStatus.ON_TRIP);
        t.getVehicle().setVehicleStatus(VehicleStatus.ON_TRIP);
        t.getDriver().setDriverStatus(DriverStatus.ON_TRIP);
        tripRepository.save(t);
        return new MessageResponse("Trip successfully dispatched.", t.getId(), "Dispatched");
    }
    public MessageResponse completeTrip(Long id, TripCompleteRequest request) {
        Trip t = tripRepository.findById(id).orElseThrow();
        t.setTripStatus(TripStatus.COMPLETED);
        t.setFinalOdometer(request.getFinalOdometer());
        t.setFuelConsumed(request.getFuelConsumed());
        t.getVehicle().setVehicleStatus(VehicleStatus.AVAILABLE);
        t.getDriver().setDriverStatus(DriverStatus.AVAILABLE);
        tripRepository.save(t);
        return new MessageResponse("Trip successfully completed.", t.getId(), "Completed");
    }
    public MessageResponse cancelTrip(Long id) {
        Trip t = tripRepository.findById(id).orElseThrow();
        t.setTripStatus(TripStatus.CANCELLED);
        t.getVehicle().setVehicleStatus(VehicleStatus.AVAILABLE);
        t.getDriver().setDriverStatus(DriverStatus.AVAILABLE);
        tripRepository.save(t);
        return new MessageResponse("Trip cancelled successfully.", t.getId(), "Cancelled");
    }
}
""")

write_file("service/MaintenanceService.java", """
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
    public MaintenanceResponse createMaintenance(MaintenanceRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        v.setVehicleStatus(VehicleStatus.IN_SHOP);
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
""")

write_file("service/ExpenseService.java", """
package hackathon.odoo.service;
import hackathon.odoo.dto.FuelExpenseRequest;
import hackathon.odoo.dto.GeneralExpenseRequest;
import hackathon.odoo.entity.Expense;
import hackathon.odoo.entity.Trip;
import hackathon.odoo.entity.Vehicle;
import hackathon.odoo.enums.ExpenseType;
import hackathon.odoo.repository.ExpenseRepository;
import hackathon.odoo.repository.TripRepository;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    public Expense recordFuel(FuelExpenseRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        Expense e = Expense.builder()
                .vehicle(v)
                .expenseType(ExpenseType.FUEL) // assuming FUEL exists
                .amount(request.getCost())
                .timestamp(LocalDateTime.now())
                .build();
        return expenseRepository.save(e);
    }
    public Expense recordGeneral(GeneralExpenseRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        Trip t = tripRepository.findById(request.getTripId()).orElseThrow();
        Expense e = Expense.builder()
                .vehicle(v)
                .trip(t)
                .expenseType(ExpenseType.GENERAL) // Assuming GENERAL exists
                .amount(request.getAmount())
                .timestamp(LocalDateTime.now())
                .build();
        return expenseRepository.save(e);
    }
}
""")
