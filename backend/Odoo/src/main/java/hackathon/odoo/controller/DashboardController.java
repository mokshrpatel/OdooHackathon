package hackathon.odoo.controller;
import hackathon.odoo.dto.KpiResponse;
import hackathon.odoo.dto.RoiResponse;
import hackathon.odoo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<KpiResponse> getKpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }
    @GetMapping("/reports/roi")
    public ResponseEntity<List<RoiResponse>> getRoi() {
        return ResponseEntity.ok(dashboardService.getRoi());
    }
}
