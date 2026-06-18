package com.is.a.Software.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.is.a.Software.entity.Enum.Role;
import com.is.a.Software.entity.Enum.UserStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id",nullable=false)
	
	private int id;
	@Column(name="user_name")
	private String name;
	@Column(name="user_email",unique = true,nullable=false)
	private String email;
	@Column(name="user_password",nullable=false)
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(name="role",nullable=false)
	private Role role;
	@Enumerated(EnumType.STRING)
	@Column(name="user_status",nullable=false)
	private UserStatus status;
	@Column(name = "domain_used",nullable=false)
	private int domainUsed=0;

	@Column(name = "dns_used",nullable=false)
	private int dnsUsed=0;

	
	@Column(name="createdAt",nullable=false)
    private LocalDate createdAt;
	
	
	@OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,mappedBy = "user")
	private List<Subscription> AllSubscription=new ArrayList<Subscription>();
	
	
	@OneToMany(cascade = CascadeType.ALL,orphanRemoval = true, mappedBy = "user")
    private List<Social> SocialAccount=new ArrayList<Social>();
	
	
	@OneToMany(mappedBy = "user",orphanRemoval = true,cascade = CascadeType.ALL)
	private List<Domain> domains=new ArrayList<>();
    
	@PrePersist
	public void setCreatedAt() {
	    this.createdAt = LocalDate.now();	
	    
	}
	
	
	
    
	
	
}
