package com.is.a.Software.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialDto {
   
	private String githubUsername;
	private boolean githubStar;
	private LocalDate lastCheck;
}
