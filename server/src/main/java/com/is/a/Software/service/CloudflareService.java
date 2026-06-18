package com.is.a.Software.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.is.a.Software.entity.DnsRecords;
import com.is.a.Software.exception.CloudflareApiException;

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
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/zones/" + zoneId + "/dns_records/" + cloudflareId,
            HttpMethod.DELETE,
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

    @SuppressWarnings("unchecked")
    public int deleteRecordsBySubdomain(String subdomain) {
        String fullName = subdomain + ".is-a.software";
        String listUrl = baseUrl + "/zones/" + zoneId + "/dns_records?name=" + fullName + "&per_page=100";

        HttpEntity<?> listRequest = new HttpEntity<>(authHeaders());
        ResponseEntity<Map> listResponse = restTemplate.exchange(listUrl, HttpMethod.GET, listRequest, Map.class);

        Map<String, Object> listBody = listResponse.getBody();
        if (listBody == null || !Boolean.TRUE.equals(listBody.get("success"))) {
            return 0;
        }

        List<Map<String, Object>> results = (List<Map<String, Object>>) listBody.get("result");
        if (results == null || results.isEmpty()) {
            return 0;
        }

        int deleted = 0;
        for (Map<String, Object> record : results) {
            String recordId = (String) record.get("id");
            if (recordId == null) continue;

            HttpEntity<?> deleteRequest = new HttpEntity<>(authHeaders());
            ResponseEntity<Map> deleteResponse = restTemplate.exchange(
                baseUrl + "/zones/" + zoneId + "/dns_records/" + recordId,
                HttpMethod.DELETE, deleteRequest, Map.class
            );

            Map<String, Object> deleteBody = deleteResponse.getBody();
            if (deleteBody != null && Boolean.TRUE.equals(deleteBody.get("success"))) {
                deleted++;
            }
        }
        return deleted;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> verifyToken() {
        HttpEntity<?> request = new HttpEntity<>(authHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            baseUrl + "/user/tokens/verify",
            HttpMethod.GET,
            request,
            Map.class
        );
        return response.getBody();
    }
}
