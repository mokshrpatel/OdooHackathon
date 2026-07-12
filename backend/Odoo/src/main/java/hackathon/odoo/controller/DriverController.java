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
