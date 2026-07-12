package hackathon.odoo.entity;

import hackathon.odoo.enums.MaintenanceStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Builder
@Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;

    @ManyToOne
    @JoinColumn(name = "vehicleId")
    private Vehicle vehicle;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double cost;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
