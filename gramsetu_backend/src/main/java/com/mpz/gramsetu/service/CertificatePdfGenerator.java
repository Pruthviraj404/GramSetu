package com.mpz.gramsetu.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.mpz.gramsetu.entity.CertificateApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class CertificatePdfGenerator {

    @Autowired
    private TemplateEngine templateEngine; // Thymeleaf Template Loader

    public byte[] generate(CertificateApplication app) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            
            // 1. Thymeleaf Variables Bind Karein
            Context context = new Context();
            context.setVariable("app", app);
            
            // Date Format karein (08-07-2026)
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedDate = app.getApprovedAt() != null ? app.getApprovedAt().format(dateFormatter) : "08-07-2026";
            context.setVariable("formattedDate", formattedDate);

            // 2. HTML template ko parse karke string banayein
            // Yeh automatic 'src/main/resources/templates/certificate.html' ko uthayega
            String htmlContent = templateEngine.process("certificate", context);

            // 3. iText html2pdf converter se full CSS ke sath PDF generate karein
            HtmlConverter.convertToPdf(htmlContent, outputStream);

            return outputStream.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("HTML/CSS se professional PDF render karne me dikkat aayi: ", e);
        }
    }
}