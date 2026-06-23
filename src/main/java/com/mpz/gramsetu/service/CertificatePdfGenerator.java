package com.mpz.gramsetu.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.mpz.gramsetu.entity.CertificateApplication;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class CertificatePdfGenerator {

    public byte[] generate(CertificateApplication app) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (
                PdfWriter writer = new PdfWriter(out);
                PdfDocument pdfDoc = new PdfDocument(writer);
                Document document = new Document(pdfDoc, PageSize.A4)
        ) {

            // Title
            document.add(
                    new Paragraph("GRAM PANCHAYAT")
                            .setTextAlignment(TextAlignment.CENTER)
                            .setFontSize(20)
                            .setBold()
            );

            // Certificate Type
            document.add(
                    new Paragraph(app.getCertificateType().name() + " CERTIFICATE")
                            .setTextAlignment(TextAlignment.CENTER)
                            .setFontSize(16)
                            .setFontColor(ColorConstants.DARK_GRAY)
                            .setBold()
            );

            document.add(new Paragraph("\n"));

            // Certificate Details
            document.add(
                    new Paragraph("Certificate No: " + app.getCertificateNumber())
            );

            document.add(
                    new Paragraph("Issued To: " + app.getUser().getName())
            );

            document.add(
                    new Paragraph("Mobile: " + app.getUser().getMobileNumber())
            );

            document.add(
                    new Paragraph(
                            "Address: "
                                    + app.getUser().getAddress()
                                    + ", "
                                    + app.getUser().getArea()
                    )
            );

            if (app.getGeneratedAt() != null) {
                document.add(
                        new Paragraph(
                                "Issue Date: "
                                        + app.getGeneratedAt()
                                                .format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                        )
                );
            }

            document.add(new Paragraph("\n\n"));

            document.add(
                    new Paragraph(
                            "This is to certify that the above details are verified and approved "
                                    + "by the Gram Panchayat office as per records available."
                    )
            );

            document.add(new Paragraph("\n\n\n"));

            document.add(
                    new Paragraph("Authorized Signatory")
                            .setTextAlignment(TextAlignment.RIGHT)
            );

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate certificate PDF: " + e.getMessage(),
                    e
            );
        }
    }
}