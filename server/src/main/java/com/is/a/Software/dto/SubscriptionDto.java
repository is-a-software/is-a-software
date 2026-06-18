package com.is.a.Software.dto;

import java.time.LocalDate;

import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.entity.Enum.SubscriptionStatus;

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
public class SubscriptionDto {
	private Plan plan;
	private SubscriptionStatus status;
	private LocalDate start_date;
	private LocalDate end_date;
}
