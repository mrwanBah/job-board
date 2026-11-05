package com.jobboard.security;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
@Component
public class JwtUtil {
    private final NimbusJwtEncoder encoder;
    private final NimbusJwtDecoder decoder;
    private final long expirationMillis;
    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expirationMillis) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("JWT_SECRET must contain at least 32 bytes");
        }
        if (expirationMillis <= 0) throw new IllegalArgumentException("JWT expiration must be positive");
        var key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        encoder = new NimbusJwtEncoder(new com.nimbusds.jose.jwk.source.ImmutableSecret<>(key));
        decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        decoder.setJwtValidator(new JwtTimestampValidator(java.time.Duration.ZERO));
        this.expirationMillis = expirationMillis;
    }
    public String generateToken(String email, String role) {
        Instant now = Instant.now();
        var claims = JwtClaimsSet.builder().subject(email).claim("role", role).issuedAt(now)
                .expiresAt(now.plusMillis(expirationMillis)).build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }
    public String extractEmail(String token) { return decoder.decode(token).getSubject(); }
    public boolean isTokenValid(String token, String email) {
        try { return email != null && email.equals(extractEmail(token)); }
        catch (JwtException | IllegalArgumentException ex) { return false; }
    }
}
