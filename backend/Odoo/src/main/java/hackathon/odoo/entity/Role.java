package hackathon.odoo.entity;


import hackathon.odoo.enums.Roles;
import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    int id;

    @Enumerated(EnumType.STRING)
    Roles role;
}
