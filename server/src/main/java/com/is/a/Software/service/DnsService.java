package com.is.a.Software.service;

import java.util.List;
import com.is.a.Software.dto.DnsRecordsDto;


public interface DnsService {

   DnsRecordsDto createRecord(int domainId, DnsRecordsDto dto, String email);
   List<DnsRecordsDto> getRecords(int domainId, String email);
   DnsRecordsDto updateRecord(int recordId, DnsRecordsDto dto, String email);
   void deleteRecord(int recordId, String email);

}
