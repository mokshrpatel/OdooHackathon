package hackathon.odoo.controller;

import hackathon.odoo.entity.AppUser;
import hackathon.odoo.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {
    AppUserRepository appUserRepository;

    Test(AppUserRepository  appUserRepository){
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("api/testing")
    public ResponseEntity<String> testing(){
        AppUser darsh = appUserRepository.findById(1L).get();
        AppUser moksh = appUserRepository.findById(2L).get();

        return ResponseEntity
                .status(200)
                .body("Frontend and backend is integrated successfully");
    }
}
