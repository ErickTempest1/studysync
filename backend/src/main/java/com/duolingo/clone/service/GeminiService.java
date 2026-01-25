package com.duolingo.clone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String gerarExercicio(String tema) {
        try {
            // 1. O Prompt para o BMO (Instrução para a IA)
            String prompt = """
                Você é um professor de programação experiente.
                Gere um JSON com 1 exercício de múltipla escolha sobre o tema: %s.
                Use estritamente este formato JSON, sem Markdown (nada de ```json):
                {
                    "prompt": "A pergunta técnica aqui",
                    "options": [
                        {"text": "Opção A", "isCorrect": false},
                        {"text": "Opção B (a correta)", "isCorrect": true},
                        {"text": "Opção C", "isCorrect": false}
                    ]
                }
                """.formatted(tema);

            // 2. Montar o Corpo da Requisição (Payload)
            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(Map.of("text", prompt)));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));

            // 3. Configurar Cabeçalhos
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 4. Enviar para o Google! 🚀
            String finalUrl = apiUrl + "?key=" + apiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(finalUrl, entity, String.class);

            // 5. Ler a resposta
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                // O Gemini retorna um JSON complexo, precisamos pegar só o texto da resposta
                String textoResposta = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                // Limpeza extra caso a IA mande markdown
                return textoResposta.replace("```json", "").replace("```", "").trim();
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erro ao chamar o BMO: " + e.getMessage());
        }
        return null;
    }
}