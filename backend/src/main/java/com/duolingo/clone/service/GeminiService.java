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
            System.out.println("🐧 BMO: Tentando conectar com a IA...");

            // 1. Prepara a chamada
            String finalUrl = apiUrl + "?key=" + apiKey;
            String prompt = "Crie um exercício de programação sobre " + tema + " no formato JSON estrito com: 'prompt' (pergunta), 'correctAnswer' (resposta certa) e 'options' (lista de opções com 'text' e 'correct' boolean).";
            String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt + "\" }] }] }";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // 2. Tenta chamar o Google
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.postForObject(finalUrl, entity, String.class);

            // 3. Processa a resposta
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response);
            String textoGerado = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // Limpa formatação Markdown
            textoGerado = textoGerado.replace("```json", "").replace("```", "").trim();

            System.out.println("🐧 IA Respondeu: " + textoGerado);
            return textoGerado;

        } catch (Exception e) {
            // --- O PULO DO GATO: FALLBACK (PLANO B) ---
            System.err.println("⚠️ Erro na IA (Google 404/Erro): " + e.getMessage());
            System.out.println("🐧 BMO: Ativando modo de emergência (Questão Local)!");

            // Retorna um JSON fixo para o site não travar
            return "{\n" +
                    "  \"prompt\": \"(Modo Offline) Qual método imprime texto no console em Java?\",\n" +
                    "  \"correctAnswer\": \"System.out.println(...)\",\n" +
                    "  \"options\": [\n" +
                    "    {\"text\": \"System.out.printLine(...)\", \"correct\": false},\n" +
                    "    {\"text\": \"Console.log(...)\", \"correct\": false},\n" +
                    "    {\"text\": \"System.out.println(...)\", \"correct\": true}\n" +
                    "  ]\n" +
                    "}";
        }
    }
}