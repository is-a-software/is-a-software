package com.is.a.Software.entity;

import java.time.LocalDate;

import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.entity.Enum.SubscriptionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
@Table(name="user_Subscription")
public class Subscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Enumerated(EnumType.STRING)
	@Column(name="plan")
	private Plan plan;
	@Enumerated(EnumType.STRING)
	@Column(name="Subscription_status")
	private SubscriptionStatus status;
	@Column(name="start_date")
	private LocalDate start_date;
	@Column(name="end_date")
	private LocalDate end_date;
	@Column(name="createdAt")
	private LocalDate createdAt;
	
	@ManyToOne
	private User user;
	
	@PrePersist
	public void setCreatedAt() {
	    this.createdAt = LocalDate.now();	
	    
	}
	
	
	
}
