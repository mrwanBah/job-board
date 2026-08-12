package com.jobboard.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final String secret;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMillis
    ) {
        this.secret = secret;
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(String email) {
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long expiresAt = Instant.now().toEpochMilli() + expirationMillis;
        String payload = base64Url("{\"sub\":\"" + email + "\",\"exp\":" + expiresAt + "}");
        String data = header + "." + payload;

        return data + "." + sign(data);
    }

    public String extractEmail(String token) {
        String payloadJson = decodePart(token, 1);
        String marker = "\"sub\":\"";
        int start = payloadJson.indexOf(marker);
        if (start < 0) {
            return null;
        }

        start += marker.length();
        int end = payloadJson.indexOf("\"", start);
        if (end < 0) {
            return null;
        }

        return payloadJson.substring(start, end);
    }

    public boolean isTokenValid(String token, String email) {
        return email != null
                && email.equals(extractEmail(token))
                && !isExpired(token)
                && hasValidSignature(token);
    }

    private boolean isExpired(String token) {
        String payloadJson = decodePart(token, 1);
        String marker = "\"exp\":";
        int start = payloadJson.indexOf(marker);
        if (start < 0) {
            return true;
        }

        start += marker.length();
        int end = payloadJson.indexOf("}", start);
        if (end < 0) {
            return true;
        }

        long expiresAt = Long.parseLong(payloadJson.substring(start, end));
        return Instant.now().toEpochMilli() > expiresAt;
    }

    private boolean hasValidSignature(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String data = parts[0] + "." + parts[1];
        return sign(data).equals(parts[2]);
    }

    private String decodePart(String token, int index) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return "";
        }

        return new String(Base64.getUrlDecoder().decode(parts[index]), StandardCharsets.UTF_8);
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] signature = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }

    private String base64Url(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
