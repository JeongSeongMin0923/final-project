package com.example.devjobs.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

    @Value("${filepath:C:\\uploadfile\\}")  // 기본 경로를 c드라이브 uplodafile로
    private String filepath;  // 파일 저장 경로

    // 파일 업로드 메서드 (단일 파일 업로드)
    public String fileUpload(MultipartFile multipartFile, String category) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            System.out.println("파일이 null 이거나 비어 있습니다.");
            return null;
        }

        try {
            // category에 따라 하위 폴더 생성 (jobposting, resume 등)
            Path uploadDirectory = Paths.get(filepath, category);
            System.out.println("업로드 디렉토리: " + uploadDirectory);

            // 디렉토리가 존재하지 않으면 생성
            if (!Files.exists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory); // 부모 디렉토리까지 함께 생성
                System.out.println("디렉토리가 없어서 생성됨: " + uploadDirectory);
            }

            // 파일 경로 설정
            Path copyOfLocation = uploadDirectory.resolve(StringUtils.cleanPath(multipartFile.getOriginalFilename()));
            System.out.println("파일 경로: " + copyOfLocation);

            // 파일을 지정한 경로에 저장
            Files.copy(multipartFile.getInputStream(), copyOfLocation, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("파일 저장됨: " + copyOfLocation);

            // 업로드된 파일 이름 반환
            return copyOfLocation.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    // 파일 삭제 메서드
    public boolean deleteFile(String filePath) {

        try {
            Path path = Paths.get(filepath, filePath);

            if (Files.exists(path)) {
                Files.delete(path); // 파일 삭제
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }
}