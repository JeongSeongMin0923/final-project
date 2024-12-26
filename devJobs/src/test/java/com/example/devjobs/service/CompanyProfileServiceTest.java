//package com.example.devjobs.service;
//
//import com.example.devjobs.companyprofile.dto.CompanyProfileDTO;
//import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
//import com.example.devjobs.companyprofile.service.CompanyProfileService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//class CompanyProfileServiceTest {
//
//    @Autowired
//    private CompanyProfileService companyProfileService;
//
//    @Autowired
//    private CompanyProfileRepository companyProfileRepository;
//
//    @Test
//    void testRegisterCompanyProfile() {
//        // CompanyProfile 등록
//        CompanyProfileDTO companyProfileDTO = CompanyProfileDTO.builder()
//                .companyName("Test Company")
//                .companyContent("This is a test company.")
//                .industry("IT")
//                .websiteUrl("http://www.testcompany.com")
//                .build();
//
//        int companyProfileCd = companyProfileService.register(companyProfileDTO);
//
//        CompanyProfileDTO savedCompanyProfile = companyProfileService.read(companyProfileCd);
//
//        System.out.println("=== CompanyProfile 등록 테스트 ===");
//        System.out.println("Company Profile Code: " + savedCompanyProfile.getCompanyProfileCd());
//        System.out.println("Company Name: " + savedCompanyProfile.getCompanyName());
//
//        assertThat(savedCompanyProfile).isNotNull();
//        assertThat(savedCompanyProfile.getCompanyName()).isEqualTo("Test Company");
//    }
//
//    @Test
//    void testReadCompanyProfile() {
//        // CompanyProfile 등록
//        CompanyProfileDTO companyProfileDTO = CompanyProfileDTO.builder()
//                .companyName("Read Company")
//                .companyContent("This is a company for read test.")
//                .industry("Finance")
//                .websiteUrl("http://www.readcompany.com")
//                .build();
//
//        int companyProfileCd = companyProfileService.register(companyProfileDTO);
//
//        // CompanyProfile 조회
//        CompanyProfileDTO savedCompanyProfile = companyProfileService.read(companyProfileCd);
//
//        System.out.println("=== CompanyProfile 조회 테스트 ===");
//        System.out.println("Company Profile Code: " + savedCompanyProfile.getCompanyProfileCd());
//        System.out.println("Company Name: " + savedCompanyProfile.getCompanyName());
//        System.out.println("Industry: " + savedCompanyProfile.getIndustry());
//
//        assertThat(savedCompanyProfile).isNotNull();
//        assertThat(savedCompanyProfile.getCompanyName()).isEqualTo("Read Company");
//    }
//
//    @Test
//    void testModifyCompanyProfile() {
//        // CompanyProfile 등록
//        CompanyProfileDTO companyProfileDTO = CompanyProfileDTO.builder()
//                .companyName("Modify Company")
//                .companyContent("This is a company for modify test.")
//                .industry("Healthcare")
//                .websiteUrl("http://www.modifycompany.com")
//                .build();
//
//        int companyProfileCd = companyProfileService.register(companyProfileDTO);
//
//        // 수정
//        CompanyProfileDTO modifyDTO = CompanyProfileDTO.builder()
//                .companyProfileCd(companyProfileCd)
//                .companyName("Updated Company")
//                .industry("Updated Industry")
//                .build();
//
//        companyProfileService.modify(modifyDTO);
//
//        CompanyProfileDTO updatedCompanyProfile = companyProfileService.read(companyProfileCd);
//
//        System.out.println("=== CompanyProfile 수정 테스트 ===");
//        System.out.println("Updated Company Name: " + updatedCompanyProfile.getCompanyName());
//        System.out.println("Updated Industry: " + updatedCompanyProfile.getIndustry());
//
//        assertThat(updatedCompanyProfile).isNotNull();
//        assertThat(updatedCompanyProfile.getCompanyName()).isEqualTo("Updated Company");
//        assertThat(updatedCompanyProfile.getIndustry()).isEqualTo("Updated Industry");
//    }
//
//    @Test
//    void testRemoveCompanyProfile() {
//        // CompanyProfile 등록
//        CompanyProfileDTO companyProfileDTO = CompanyProfileDTO.builder()
//                .companyName("Delete Company")
//                .companyContent("This is a company for delete test.")
//                .industry("E-commerce")
//                .websiteUrl("http://www.deletecompany.com")
//                .build();
//
//        int companyProfileCd = companyProfileService.register(companyProfileDTO);
//
//        // 삭제
//        companyProfileService.remove(companyProfileCd);
//
//        Optional<?> deletedCompanyProfile = companyProfileRepository.findById(companyProfileCd);
//
//        System.out.println("=== CompanyProfile 삭제 테스트 ===");
//        System.out.println("Deleted Company Exists: " + deletedCompanyProfile.isPresent());
//
//        assertThat(deletedCompanyProfile).isEmpty();
//    }
//
//    @Test
//    void testGetListCompanyProfiles() {
//        // 여러 개 등록
//        companyProfileService.register(
//                CompanyProfileDTO.builder()
//                        .companyName("Company A")
//                        .companyContent("Content A")
//                        .industry("IT")
//                        .websiteUrl("http://www.companya.com")
//                        .build()
//        );
//
//        companyProfileService.register(
//                CompanyProfileDTO.builder()
//                        .companyName("Company B")
//                        .companyContent("Content B")
//                        .industry("Finance")
//                        .websiteUrl("http://www.companyb.com")
//                        .build()
//        );
//
//        // 리스트 조회
//        List<CompanyProfileDTO> companyProfiles = companyProfileService.getList();
//
//        System.out.println("=== CompanyProfile 리스트 조회 테스트 ===");
//        System.out.println("Total Profiles: " + companyProfiles.size());
//        for (CompanyProfileDTO dto : companyProfiles) {
//            System.out.println("Company Name: " + dto.getCompanyName());
//        }
//
//        assertThat(companyProfiles).isNotEmpty();
//    }
//}