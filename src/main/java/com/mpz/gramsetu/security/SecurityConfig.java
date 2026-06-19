package com.mpz.gramsetu.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .formLogin(form -> form.disable())
                                .httpBasic(basic -> basic.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // Citizen routes — specific first
                                                .requestMatchers(HttpMethod.GET, "/api/taxes/my").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/taxes/my/filter").authenticated()

                                                // Payment routes
                                                .requestMatchers(HttpMethod.POST, "/api/payments").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/payments/history")
                                                .authenticated()

                                                // Complaint routes
                                                .requestMatchers(HttpMethod.POST, "/api/complaints").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/complaints/my").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/complaints").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/complaints/**").hasRole("ADMIN")

                                                // Admin tax routes
                                                .requestMatchers(HttpMethod.POST, "/api/taxes").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/taxes").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/taxes/**").hasRole("ADMIN")

                                                // Admin user routes
                                                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/payments").hasRole("ADMIN")

                                                // Waterman routes
                                                .requestMatchers("/api/water-alerts/**").hasAnyRole("WATERMAN", "ADMIN")

                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}