package hackathon.odoo.repository;

import hackathon.odoo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import hackathon.odoo.enums.Roles;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRole(Roles role);
}
