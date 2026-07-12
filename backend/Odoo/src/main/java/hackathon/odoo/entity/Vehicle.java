package hackathon.odoo.entity;

import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.enums.VehicleType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Entity
@Builder
@Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String registrationNumber;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false)
    private int maxLoadCapacity; // in kgs

    @Column(nullable = false)
    private Double odometer; // in kms

    @Column(nullable = false)
    private Double acquisition_cost;

    @Column(nullable = false)
    private VehicleStatus vehicleStatus;
}
