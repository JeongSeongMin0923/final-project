package com.example.devjobs.common.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // 파일 저장 경로는 설정 파일(application.properties)에서 관리
    @Value("${filepath}")
    private String fileStorageLocation;

    // 파일 업로드 메서드
    public String storeFile(MultipartFile file, String subdirectory) {
        // 파일 이름 정리 및 중복 방지를 위한 UUID 생성
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            // 서브디렉토리 경로 생성 (이력서, 구인공고, 프로필 등에 따라)
            Path targetLocation = Paths.get(fileStorageLocation + File.separator + subdirectory)
                    .toAbsolutePath()
                    .normalize();

            // 디렉토리가 존재하지 않으면 생성
            if (!Files.exists(targetLocation)) {
                Files.createDirectories(targetLocation);
            }

            // 파일 저장
            Path filePath = targetLocation.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 반환할 파일의 상대 경로 (subdirectory/fileName)
            return subdirectory + "/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    // 파일 삭제 메서드
    public void deleteFile(String filePath) {
        try {
            Path targetPath = Paths.get(fileStorageLocation + File.separator + filePath).normalize();
            Files.deleteIfExists(targetPath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + filePath, ex);
        }
    }
}