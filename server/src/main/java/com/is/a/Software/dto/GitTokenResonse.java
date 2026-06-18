	package com.is.a.Software.dto;
	
	import lombok.AllArgsConstructor;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public class GitTokenResonse {
	
		
		private String access_token;
	    private String token_type;
	    private String scope;
	}
