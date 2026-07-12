package hackathon.odoo.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    private Long vehicleId;
    private Long tripId; // nullable (e.g. for fuel when not associated with a trip)
    private String expenseType; // "FUEL", "TOLL", "FINE", etc.
    private Double amount;
    private LocalDate date;
}
