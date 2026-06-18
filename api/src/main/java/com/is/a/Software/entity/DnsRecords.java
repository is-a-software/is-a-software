package com.is.a.Software.entity;

import java.time.LocalDate;

import com.is.a.Software.entity.Enum.RecordType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dns_record",
uniqueConstraints = {
    @UniqueConstraint(columnNames = {"domain", "name", "type", "value"})
})
public class DnsRecords {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne
    @JoinColumn(name = "domain",nullable=false)
    private Domain domain;

	@Column(nullable=false)
    private String name;


	
    
	@Enumerated(EnumType.STRING)
	@Column(length = 10, nullable = false)
    private RecordType type;

	@Column(nullable=false)
    private String value;

    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 300")
    private Long ttl = 300L;

    @Column(name = "cloudflare_id", nullable = true)
    private String cloudflareId;

    @Column(name = "created_at",nullable=false)
    private LocalDate  createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }
}
