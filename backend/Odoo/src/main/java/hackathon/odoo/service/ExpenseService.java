package hackathon.odoo.service;
import hackathon.odoo.dto.ExpenseRequest;
import hackathon.odoo.entity.Expense;
import hackathon.odoo.entity.Trip;
import hackathon.odoo.entity.Vehicle;
import hackathon.odoo.enums.ExpenseType;
import hackathon.odoo.repository.ExpenseRepository;
import hackathon.odoo.repository.TripRepository;
import hackathon.odoo.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public Expense recordExpense(ExpenseRequest request) {
        Vehicle v = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
        Trip t = null;
        if (request.getTripId() != null) {
            t = tripRepository.findById(request.getTripId()).orElse(null);
        }
        
        Expense e = Expense.builder()
                .vehicle(v)
                .trip(t)
                .expenseType(ExpenseType.valueOf(request.getExpenseType().toUpperCase()))
                .amount(request.getAmount())
                .timestamp(LocalDateTime.now())
                .build();
                
        return expenseRepository.save(e);
    }
}
