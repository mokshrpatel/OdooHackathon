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
    @GetMapping
    public ResponseEntity<java.util.List<TripResponse>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }
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
