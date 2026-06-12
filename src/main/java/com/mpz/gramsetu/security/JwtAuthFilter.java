package com.mpz.gramsetu.security;



import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor

public class JwtAuthFilter extends OncePerRequestFilter{

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
       
       
        String authHeader = request.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer")){
            chain.doFilter(request, response);
        }


        String token = authHeader.substring(7);

        if(!jwtUtil.isTokenvalid(token)){
            chain.doFilter(request, response);
            return;
        }


        String mobile = jwtUtil.extractMobile(token);
        User user = userRepository.findByMobileNumber(mobile).orElse(null);

        if(user != null && SecurityContextHolder.getContext().getAuthentication()==null){
             UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities()
                    );
            SecurityContextHolder.getContext().setAuthentication(authToken);

        }
        chain.doFilter(request, response);
        



    }

 


    
}
