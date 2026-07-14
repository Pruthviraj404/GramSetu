package com.mpz.gramsetu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationMailingService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmailAlert(String toEmail, String title, String message, String type) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(toEmail);

            String subjectPrefix = switch (type) {

                case "EMERGENCY" -> "⚠️ [CRITICAL ALERT] ";
                case "WATER_SUPPLY" -> "💧 [WATER SERVICE UPDATE] ";
                case "TAX_REMINDER" -> "💼 [TAX ADVISORY] ";
                case "GRAM_SABHA_MEETING" -> "🏛️ [GRAM SABHA NOTICE] ";
                default -> "📢 [GRAMSETU UPDATE] ";

            };

            mail.setSubject(subjectPrefix + title);

            String emailBody = "Dear Citizen,\n\n" +
                    "A new notice has been published by the Gram Panchayat Office:\n\n" +
                    "--------------------------------------------------\n" +
                    "Subject: " + title + "\n" +
                    "Message:\n" + message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Please check your GramSetu dashboard for further details.\n\n" +
                    "Regards,\n" +
                    "Gram Panchayat Administration Office";

            mail.setText(emailBody);

            mailSender.send(mail);
            System.out.println("Email successfully dispatched to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Email Dispatch Failed for " + toEmail + " -> " + e.getMessage());

        }
    }

}
