package hackathon.odoo.entity;

import hackathon.odoo.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "userId")
    private AppUser appUser;

    @Column(nullable = false, length = 15)
    private String licenseNumber;

    @Column(nullable = false)
    private LocalDate licenseExpiryDate;

    @Column(nullable = false, length = 10)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    private DriverStatus driverStatus;


}
