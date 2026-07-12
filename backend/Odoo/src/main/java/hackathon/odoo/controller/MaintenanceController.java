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
