package hackathon.odoo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<hackathon.odoo.entity.Expense, Long>{

}
