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
                case "OTP" -> "🔐 [VERIFICATION] ";
                case "EMERGENCY" -> "⚠️ [CRITICAL ALERT] ";
                case "WATER_SUPPLY" -> "💧 [WATER SERVICE UPDATE] ";
                case "TAX_REMINDER" -> "💼 [TAX ADVISORY] ";
                case "GRAM_SABHA_MEETING" -> "🏛️ [GRAM SABHA NOTICE] ";
                default -> "📢 [GRAMSETU UPDATE] ";

            };

            mail.setSubject(subjectPrefix + title);

            String emailBody = switch(type){
                case "OTP"->
                    "Namaskar,\n\n" +
                    "Your secure verification OTP code for GramSetu portal login is:\n\n" +
                    "👉   " + message + "   \n\n" +
                    "This code is valid for 5 minutes. For security reasons, please do not share this with anyone.\n\n" +
                    "Regards,\n" +
                    "Gram Panchayat IT Desk";

                case "EMERGENCY" -> 
                    "⚠️ CRITICAL NOTICE TO ALL CITIZENS\n\n" +
                    "Please read the following urgent notice from the Gram Panchayat Office immediately:\n" +
                    "==================================================\n" +
                    "Alert: " + title + "\n" +
                    "Details:\n" + message + "\n" +
                    "==================================================\n\n" +
                    "Please take necessary precautions and share this message with your neighbors.\n\n" +
                    "Regards,\n" +
                    "Emergency Management Cell, Gram Panchayat";

                case "WATER_SUPPLY" -> 
                    "Dear Citizen,\n\n" +
                    "There is an update regarding the local water supply system:\n" +
                    "--------------------------------------------------\n" +
                    "Update: " + title + "\n" +
                    "Schedule/Details:\n" + message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Kindly plan your water storage accordingly to avoid inconvenience.\n\n" +
                    "Regards,\n" +
                    "Water Works Department";

                case "TAX_REMINDER" -> 
                    "Dear Property Owner / Citizen,\n\n" +
                    "This is a friendly reminder regarding your pending Gram Panchayat taxes/dues:\n" +
                    "--------------------------------------------------\n" +
                    "Notice: " + title + "\n" +
                    "Message: " + message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "You can pay your taxes easily online through your GramSetu dashboard to avoid late penalties.\n\n" +
                    "Regards,\n" +
                    "Tax & Revenue Department";

                case "GRAM_SABHA_MEETING" -> 
                    "Important Notice for All Residents,\n\n" +
                    "An official Gram Sabha Meeting has been scheduled. Your presence and participation are highly valuable for village development:\n" +
                    "--------------------------------------------------\n" +
                    "Agenda: " + title + "\n" +
                    "Timings & Venue:\n" + message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Please make sure to attend and put forward your opinions.\n\n" +
                    "Regards,\n" +
                    "Sarpanch / Gram Sevak Office";

                default -> 
                    "Dear Citizen,\n\n" +
                    "A new general update has been published on the GramSetu platform:\n" +
                    "--------------------------------------------------\n" +
                    "Subject: " + title + "\n" +
                    "Message:\n" + message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Log in to your dashboard to stay updated with village administration.\n\n" +
                    "Regards,\n" +
                    "Gram Panchayat Office";
            
            };

            mail.setText(emailBody);

            mailSender.send(mail);
            System.out.println("Email successfully dispatched to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Email Dispatch Failed for " + toEmail + " -> " + e.getMessage());

        }
    }

}
