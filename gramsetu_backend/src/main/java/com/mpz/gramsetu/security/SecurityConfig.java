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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // ===== Public =====
                    .requestMatchers("/api/auth/**").permitAll()

                    // ===== Tax — citizen =====
                    .requestMatchers(HttpMethod.GET, "/api/taxes/my").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/taxes/my/filter").authenticated()

                    // ===== Tax — admin =====
                    .requestMatchers(HttpMethod.POST, "/api/taxes").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/taxes").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/taxes/**").hasRole("ADMIN")

                    // ===== Payments — citizen =====
                    .requestMatchers(HttpMethod.POST, "/api/payments/create-order").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/payments/verify").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/payments/history").authenticated()

                    // ===== Payments — admin =====
                    .requestMatchers(HttpMethod.GET, "/api/payments").hasRole("ADMIN")

                    // ===== Complaints — citizen =====
                    .requestMatchers(HttpMethod.POST, "/api/complaints").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/complaints/my").authenticated()

                    // ===== Complaints — admin =====
                    .requestMatchers(HttpMethod.GET, "/api/complaints").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/complaints/**").hasRole("ADMIN")

                    // ===== Users — admin =====
                    .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")

                    // ===== Certificates — admin (specific first) =====
                    .requestMatchers(HttpMethod.GET, "/api/certificates/admin/all").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/certificates/*/verify").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/certificates/*/approve").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/certificates/*/reject").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/certificates/*/generate").hasRole("ADMIN")

                    // ===== Certificates — upload/view (before generic citizen rules) =====
                    .requestMatchers(HttpMethod.POST, "/api/certificates/upload").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/certificates/view-file/**").permitAll()

                    // ===== Certificates — citizen (generic last) =====
                    .requestMatchers(HttpMethod.POST, "/api/certificates").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/certificates/my").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/certificates/*/download").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/certificates/*").authenticated()

                    // ===== Notifications — admin (specific first) =====
                    .requestMatchers(HttpMethod.POST, "/api/notifications").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/notifications/admin/all").hasRole("ADMIN")

                    // ===== Notifications — citizen =====
                    .requestMatchers(HttpMethod.GET, "/api/notifications/my").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/notifications/*").authenticated()

                    // ===== Water Alerts — waterman/admin =====
                    .requestMatchers(HttpMethod.POST, "/api/water-alerts").hasAnyRole("WATERMAN", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/api/water-alerts").hasAnyRole("WATERMAN", "ADMIN")

                    // ===== Water Alerts — citizen =====
                    .requestMatchers(HttpMethod.GET, "/api/water-alerts/my").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/water-alerts/*").authenticated()

                    // ===== Dashboard =====
                    .requestMatchers(HttpMethod.GET, "/api/dashboard/citizen").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/dashboard/admin").hasRole("ADMIN")

                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",   // React default
                "http://localhost:5173"    // Vite default
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}