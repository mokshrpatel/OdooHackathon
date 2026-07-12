package hackathon.odoo.entity;

import hackathon.odoo.enums.ExpenseType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Builder
@Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicleId")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "tripId")
    private Trip trip;

    @Enumerated(EnumType.STRING)
    private ExpenseType expenseType;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
