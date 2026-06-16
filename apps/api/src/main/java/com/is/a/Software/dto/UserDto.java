package com.is.a.Software.dto;





import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class UserDto {


//	@NotBlank(message="Required...!")
	private String name;
//	@NotBlank(message="Required...!")
//	@Email(message="Invalid Email")
	private String email;
//	@NotBlank(message="Required...!")
	private String password;

}
