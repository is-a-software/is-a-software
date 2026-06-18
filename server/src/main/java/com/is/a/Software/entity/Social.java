	package com.is.a.Software.entity;
	
	import java.time.LocalDate;
	
	import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.JoinColumn;
	import jakarta.persistence.ManyToOne;
	import jakarta.persistence.Table;
	import jakarta.persistence.UniqueConstraint;
	import lombok.AllArgsConstructor;
	import lombok.Builder;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	@Builder
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Entity
	@Table(name="social",
	uniqueConstraints = @UniqueConstraint(columnNames = {"user_id"}))
	public class Social {
	
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private int id;
		@Column(name="github_username")
	    private String github;
		@Column(name="github_star")
	    private boolean githubStar;
	    @Column(name="lastCheck")
	    private LocalDate lastCheck;
	    @Column(name = "bonus_claimed")
	    private boolean bonusClaimed = false;
		@ManyToOne
		@JoinColumn(name = "user_id")
	    private User user;
	    
	}
