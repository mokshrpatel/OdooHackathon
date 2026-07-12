import os

base_dir = r"c:\Users\moksh\Desktop\Odoo\OdooHackathon\backend\Odoo\src\main\java\hackathon\odoo"

def replace_in_file(path, old, new):
    full_path = os.path.join(base_dir, path)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(old, new)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

# Fix ExpenseRepository
replace_in_file("repository/ExpenseRepository.java", 
                "JpaRepository<ExpenseRepository, Long>", 
                "JpaRepository<hackathon.odoo.entity.Expense, Long>")

# Fix DashboardService
replace_in_file("service/DashboardService.java", "VehicleStatus.IN_SHOP", "VehicleStatus.MAINTENANCE")
replace_in_file("service/DashboardService.java", "TripStatus.ON_TRIP", "TripStatus.DISPATCHED")
replace_in_file("service/DashboardService.java", "hackathon.odoo.enums.DriverStatus.ON_TRIP", "hackathon.odoo.enums.DriverStatus.ONTRIP")

# Fix TripService
replace_in_file("service/TripService.java", "TripStatus.ON_TRIP", "TripStatus.DISPATCHED")
replace_in_file("service/TripService.java", "VehicleStatus.ON_TRIP", "VehicleStatus.ONTRIP")
replace_in_file("service/TripService.java", "DriverStatus.ON_TRIP", "DriverStatus.ONTRIP")

# Fix MaintenanceService
replace_in_file("service/MaintenanceService.java", "VehicleStatus.IN_SHOP", "VehicleStatus.MAINTENANCE")

# Fix ExpenseService
replace_in_file("service/ExpenseService.java", "ExpenseType.GENERAL", "ExpenseType.valueOf(request.getExpenseType().toUpperCase())")
