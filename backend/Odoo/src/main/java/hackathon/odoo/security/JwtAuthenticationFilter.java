package hackathon.odoo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailService userDetailService;

    JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailService userDetailService){
        this.jwtService = jwtService;
        this.userDetailService = userDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. Extract Authorization Header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Check if header is missing or doesn't start with "Bearer "
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response); // Pass it down the chain (it will fail later if it's a protected route)
            return;
        }
        // 3. Extract token and username
        jwt = authHeader.substring(7);
        username = jwtService.extractUsername(jwt);

        // 4. If we have a username, and they aren't already authenticated in this session...
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            // Fetch the user from the database
            UserDetails userDetails = this.userDetailService.loadUserByUsername(username);

            // 5. If the token is valid, officially authenticate them in the spring security context
            if(jwtService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

//                It captures things like the user's IP address and their browser session ID.
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // This is the line that actually "logs the user in" for this specific HTTP request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. continue to the filter chain
        filterChain.doFilter(request,response);
    }
}
