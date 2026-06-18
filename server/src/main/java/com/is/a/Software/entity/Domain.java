package com.is.a.Software.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "domain")
public class Domain {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne
	@JoinColumn(name="user", nullable=false)
	private User user;
	@Column(name="subdomain",unique=true, nullable=false)
	private String subdomain;
	@Column(name="created_at",nullable=false)
	private LocalDate createdAt;
	
	@OneToMany(mappedBy = "domain", cascade = CascadeType.ALL,orphanRemoval = true)
	private List<DnsRecords> dns=new ArrayList<>();
	
	@PrePersist
	public void prePersist() {
		this.createdAt=LocalDate.now();
	}
}