package com.is.a.Software.service;

import java.util.List;
import com.is.a.Software.dto.DnsRecordsDto;


public interface DnsService {

   /** Every account gets this many DNS records in total, across all its subdomains. */
   int RECORD_LIMIT_PER_USER = 3;


   DnsRecordsDto createRecord(int domainId, DnsRecordsDto dto, String email);
   List<DnsRecordsDto> getRecords(int domainId, String email);
   DnsRecordsDto updateRecord(int recordId, DnsRecordsDto dto, String email);
   void deleteRecord(int recordId, String email);

}
