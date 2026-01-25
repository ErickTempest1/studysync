package com.duolingo.clone; // Certifique-se que o pacote está certo

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Libera acesso total para o Frontend
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // A porta do seu React/Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}