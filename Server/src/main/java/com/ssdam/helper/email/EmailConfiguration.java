package com.ssdam.helper.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Properties;

@Configuration
public class EmailConfiguration {
    @Value("smtp.gmail.com")
    private String host;

    @Value("587")
    private int port;

    @Value("${EMAIL_USERNAME}")
    private String username;

    @Value("${EMAIL_PASSWORD}")
    private String password;

    @Value("true")
    private String auth;

    @Value("true")
    private String tlsEnable;


    @Bean
    public EmailSendable templateEmailSendable(TemplateEngine templateEngine) {
        return new TemplateEmailSendable(javaMailSender(), templateEngine, new Context());
    }

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", tlsEnable);

        return mailSender;
    }
}
