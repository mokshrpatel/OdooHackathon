package hackathon.odoo.dto;
import hackathon.odoo.enums.VehicleStatus;
import hackathon.odoo.enums.VehicleType;
import lombok.Data;
@Data
public class VehicleDto {
    private Long id;
    private String registrationNumber;
    private String nameModel;
    private VehicleType type;
    private Double maxLoadCapacity;
    private Double odometer;
    private Double acquisitionCost;
    private VehicleStatus status;
}
