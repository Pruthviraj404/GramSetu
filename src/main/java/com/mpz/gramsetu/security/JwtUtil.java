package com.mpz.gramsetu.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;


@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

    }

    public String generateToken(String mobileNumber,String role){
        return Jwts.builder()
                 .subject(mobileNumber)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }


    public Claims extractClaims(String token){
        return Jwts.parser()
        .verifyWith((javax.crypto.SecretKey) getSigningKey())
        .build()
        .parseSignedClaims(token)
            .getPayload();   
        
    }

    public String extractMobile(String token){
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
    return (String) extractClaims(token).get("role");
}

    public boolean isTokenValid(String token){
        try{
            return extractClaims(token).getExpiration().after(new Date());
        }catch(Exception e){
            return false;
        }
    }





    
}
