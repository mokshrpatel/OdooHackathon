package hackathon.odoo.entity;

import hackathon.odoo.enums.TripStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Entity
@Builder
@Data
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicleId")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driverId")
    private Driver driver;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private int cargoWeight;

    @Column(nullable = false)
    private int plannedDistance;

    @Enumerated (EnumType.STRING)
    private TripStatus tripStatus;

    @Column(nullable = false)
    private Double finalOdometer; // kms

    @Column(nullable = false)
    private Double fuelConsumed; // Ltr


}
