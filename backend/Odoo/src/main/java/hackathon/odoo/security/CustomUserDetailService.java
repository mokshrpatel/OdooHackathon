package hackathon.odoo.security;

import hackathon.odoo.entity.AppUser;
import hackathon.odoo.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final AppUserRepository userRepository;

    CustomUserDetailService(AppUserRepository userRepository){
        this.userRepository = userRepository;
    }

    // we will use emial as a username througout our project
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = userRepository.findByEmail(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found" + username));

        return appUser;
    }
}
