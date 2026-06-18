package com.is.a.Software.dto;

import com.is.a.Software.entity.Enum.RecordType;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DnsRecordsDto {

   private Integer id;
    private String name;
    private RecordType type;
    private String value;
    private Long ttl; 


}
