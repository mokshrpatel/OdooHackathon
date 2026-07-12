package hackathon.odoo.dto;
import hackathon.odoo.enums.DriverStatus;
import lombok.Data;
import java.time.LocalDate;
@Data
public class DriverDto {
    private Long id;
    private String name;
    private String licenseNumber;
    private String licenseCategory;
    private LocalDate licenseExpiryDate;
    private String contactNumber;
    private Integer safetyScore;
    private DriverStatus status;
}
