	package com.is.a.Software.dto;
	
	import lombok.AllArgsConstructor;
	import lombok.Builder;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	@Getter
	@Setter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public class LimitDto {
	
		private int recordsUsed;
		private int recordLimit;
		private boolean githubBonus;
		private boolean premium;
	}
