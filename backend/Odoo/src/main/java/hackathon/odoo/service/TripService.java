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
        t.setTripStatus(TripStatus.DISPATCHED);
        t.getVehicle().setVehicleStatus(VehicleStatus.ONTRIP);
        t.getDriver().setDriverStatus(DriverStatus.ONTRIP);
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
