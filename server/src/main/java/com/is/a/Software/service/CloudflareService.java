package com.is.a.Software.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.is.a.Software.entity.DnsRecords;
import com.is.a.Software.exception.CloudflareApiException;
import com.is.a.Software.exception.ZoneCapacityException;

@Service
public class CloudflareService {

    private final String apiKey;
    private final String zoneId;
    private final String baseUrl = "https://api.cloudflare.com/client/v4";
    private final RestTemplate restTemplate;

    public CloudflareService(
            @Value("${CF_API_KEY}") String apiKey,
            @Value("${CF_ZONE_ID}") String zoneId) {
        this.apiKey = apiKey;
        this.zoneId = zoneId;
        this.restTemplate = new RestTemplate();
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private String resolveName(String subdomain, String recordName) {
        if (recordName == null || recordName.equals("@")) {
            return subdomain + ".is-a.software";
        }
        return recordName + "." + subdomain + ".is-a.software";
    }

    private long clampTtl(Long ttl) {
        if (ttl == null) return 120;
        return Math.max(ttl, 120);
    }

    @SuppressWarnings("unchecked")
    private String executeCreate(String subdomain, DnsRecords record) {
        String fullName = resolveName(subdomain, record.getName());

        Map<String, Object> body = Map.of(
            "type", record.getType().name(),
            "name", fullName,
            "content", record.getValue(),
            "ttl", clampTtl(record.getTtl()),
            "proxied", false
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, authHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/zones/" + zoneId + "/dns_records",
            HttpMethod.POST,
            request,
            Map.class
        );

        Map<String, Object> respBody = response.getBody();
        if (respBody == null || !Boolean.TRUE.equals(respBody.get("success"))) {
            int httpStatus = response.getStatusCode().value();
            List<Map<String, Object>> errors = respBody != null
                ? (List<Map<String, Object>>) respBody.get("errors")
                : List.of();
            String errorMsg = "Cloudflare API error";
            if (!errors.isEmpty()) {
                errorMsg = errors.toString();
            }
            throw new CloudflareApiException(
                "Failed to create DNS record on Cloudflare: " + errorMsg,
                httpStatus, errors
            );
        }

        Map<String, Object> result = (Map<String, Object>) respBody.get("result");
        return (String) result.get("id");
    }

    @SuppressWarnings("unchecked")
    private void executeUpdate(String subdomain, DnsRecords record) {
        String cloudflareId = record.getCloudflareId();
        if (cloudflareId == null || cloudflareId.isBlank()) {
            return;
        }

        String fullName = resolveName(subdomain, record.getName());

        Map<String, Object> body = Map.of(
            "type", record.getType().name(),
            "name", fullName,
            "content", record.getValue(),
            "ttl", clampTtl(record.getTtl()),
            "proxied", false
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, authHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/zones/" + zoneId + "/dns_records/" + cloudflareId,
            HttpMethod.PUT,
            request,
            Map.class
        );

        Map<String, Object> respBody = response.getBody();
        if (respBody == null || !Boolean.TRUE.equals(respBody.get("success"))) {
            int httpStatus = response.getStatusCode().value();
            List<Map<String, Object>> errors = respBody != null
                ? (List<Map<String, Object>>) respBody.get("errors")
                : List.of();
            String errorMsg = "Cloudflare API error";
            if (!errors.isEmpty()) {
                errorMsg = errors.toString();
            }
            throw new CloudflareApiException(
                "Failed to update DNS record on Cloudflare: " + errorMsg,
                httpStatus, errors
            );
        }
    }

    @SuppressWarnings("unchecked")
    private void executeDelete(String cloudflareId) {
        if (cloudflareId == null || cloudflareId.isBlank()) {
            return;
        }

        HttpEntity<?> request = new HttpEntity<>(authHeaders());
        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(
                baseUrl + "/zones/" + zoneId + "/dns_records/" + cloudflareId,
                HttpMethod.DELETE,
                request,
                Map.class
            );
        } catch (HttpClientErrorException.NotFound alreadyGone) {
            return; // deleting is idempotent: a record that no longer exists is the desired state
        }

        Map<String, Object> respBody = response.getBody();
        if (respBody == null || !Boolean.TRUE.equals(respBody.get("success"))) {
            int httpStatus = response.getStatusCode().value();
            List<Map<String, Object>> errors = respBody != null
                ? (List<Map<String, Object>>) respBody.get("errors")
                : List.of();
            String errorMsg = "Cloudflare API error";
            if (!errors.isEmpty()) {
                errorMsg = errors.toString();
            }
            throw new CloudflareApiException(
                "Failed to delete DNS record on Cloudflare: " + errorMsg,
                httpStatus, errors
            );
        }
    }

    public String createRecord(String subdomain, DnsRecords record) {
        return executeCreate(subdomain, record);
    }

    public void updateRecord(String subdomain, DnsRecords record) {
        executeUpdate(subdomain, record);
    }

    public void deleteRecord(String cloudflareId) {
        executeDelete(cloudflareId);
    }

    /** Cloudflare Free zones created after 2024-09-01 hold at most this many records. */
    public static final int ZONE_RECORD_LIMIT = 200;

    /** Refuses new records once the zone is full, with a clear error instead of a raw Cloudflare one. */
    public void ensureZoneCapacity() {
        if (countRecords("") >= ZONE_RECORD_LIMIT) {
            throw new ZoneCapacityException();
        }
    }

    /**
     * True if Cloudflare already serves records at {@code <subdomain>.is-a.software} or below it.
     * Protects live records that have no owner in this app's database from being claimed.
     */
    public boolean hasRecordsFor(String subdomain) {
        String fullName = subdomain + ".is-a.software";
        return countRecords("&name.exact=" + encode(fullName)) > 0
            || countRecords("&name.endswith=" + encode("." + fullName)) > 0;
    }

    @SuppressWarnings("unchecked")
    private int countRecords(String filter) {
        HttpEntity<?> request = new HttpEntity<>(authHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/zones/" + zoneId + "/dns_records?per_page=1" + filter,
            HttpMethod.GET, request, Map.class
        );
        Map<String, Object> body = response.getBody();
        if (body == null || !Boolean.TRUE.equals(body.get("success"))) {
            throw new CloudflareApiException("Failed to list DNS records on Cloudflare",
                response.getStatusCode().value(), List.of());
        }
        Map<String, Object> info = (Map<String, Object>) body.get("result_info");
        return ((Number) info.get("total_count")).intValue();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
