package hackathon.odoo.entity;


import hackathon.odoo.enums.Roles;
import jakarta.persistence.*;

@Entity
public class Role {
    @Id
    int id;

    @Enumerated(EnumType.STRING)
    Roles role;
}
