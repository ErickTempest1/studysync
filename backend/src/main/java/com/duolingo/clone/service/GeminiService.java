package com.duolingo.clone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    public String gerarExercicio(String tema) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper objectMapper = new ObjectMapper();

            // 1. Monta a URL garantindo que a chave está lá
            String finalUrl = apiUrl + "?key=" + apiKey;

            // Log para debug (sem mostrar a chave inteira)
            System.out.println("🐧 BMO: Chamando IA em: " + apiUrl);

            // 2. Cria o corpo da requisição (JSON)
            String prompt = "Crie um exercício de programação sobre " + tema + " no formato JSON com: 'prompt' (pergunta), 'correctAnswer' (resposta certa) e 'options' (lista de opções).";

            String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt + "\" }] }] }";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // 3. Faz a chamada
            String response = restTemplate.postForObject(finalUrl, entity, String.class);

            // 4. Limpa a resposta para pegar só o texto
            JsonNode root = objectMapper.readTree(response);
            String textoGerado = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // Remove crases de formatação markdown se houver (```json ... ```)
            textoGerado = textoGerado.replace("```json", "").replace("```", "").trim();

            System.out.println("🐧 RESPOSTA DA IA (JSON): " + textoGerado);
            return textoGerado;

        } catch (Exception e) {
            System.err.println("Erro ao chamar o BMO: " + e.getMessage());
            return null;
        }
    }
}