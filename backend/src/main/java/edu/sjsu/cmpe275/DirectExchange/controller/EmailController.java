package edu.sjsu.cmpe275.DirectExchange.controller;

import java.io.IOException;
import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class EmailController {

    private void sendmail(String sender, String reciever, String message) throws AddressException, MessagingException, IOException {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("directexchange.cmpe275@gmail.com", "XXXX--PASTE PASSWORD HERE --XX");
            }
        });
        Message msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(sender, false));

        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(reciever));
        msg.setSubject("Message from : " + sender + " via DIRECT EXCHANGE ");
        msg.setContent(message, "text/html");
        msg.setSentDate(new Date());
        InternetAddress[] addresses = new InternetAddress[1];
        addresses[0] = new InternetAddress(sender, false);
        msg.setReplyTo(addresses);

        
        Transport.send(msg);
    }

    @RequestMapping(value = "/sendemail")
    public String sendEmail(@RequestParam String sender, @RequestParam String reciever,@RequestParam String message) throws AddressException, MessagingException, IOException {
        sendmail(sender,reciever,message);
        return "Email sent successfully";
    }
}