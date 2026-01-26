package com.duolingo.clone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${quizapi.url}")
    private String apiUrl;

    @Value("${quizapi.key}")
    private String apiKey;

    public String gerarExercicio(String tema) {
        try {
            System.out.println("🐧 BMO: Consultando a QuizAPI...");

            RestTemplate restTemplate = new RestTemplate();

            // 1. Configura o Header com a sua chave (Segurança)
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Api-Key", apiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 2. Chama a API pedindo 1 questão de código (JavaScript, Linux, etc)
            // Limit=1 garante que vem só uma pergunta
            String finalUrl = apiUrl + "?limit=1";

            ResponseEntity<String> response = restTemplate.exchange(finalUrl, HttpMethod.GET, entity, String.class);

            // 3. Lê a resposta
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // A QuizAPI devolve uma lista [ {} ], pegamos o primeiro item
            if (root.isArray() && !root.isEmpty()) {
                JsonNode questaoOriginal = root.get(0);
                return converterParaNossoFormato(questaoOriginal);
            }

            return fallback("Não encontrei perguntas novas...");

        } catch (Exception e) {
            System.err.println("⚠️ Erro na QuizAPI: " + e.getMessage());
            return fallback("O BMO perdeu a conexão. (Modo Offline)");
        }
    }

    // --- MÁGICA: Tradutor de QuizAPI -> Duolingo Clone ---
    private String converterParaNossoFormato(JsonNode q) {
        try {
            String pergunta = q.get("question").asText();

            // Descobre qual letra é a correta (answer_a_correct: "true")
            JsonNode correctAnswers = q.get("correct_answers");
            String letraCorreta = null;

            if ("true".equals(correctAnswers.get("answer_a_correct").asText())) letraCorreta = "answer_a";
            else if ("true".equals(correctAnswers.get("answer_b_correct").asText())) letraCorreta = "answer_b";
            else if ("true".equals(correctAnswers.get("answer_c_correct").asText())) letraCorreta = "answer_c";
            else if ("true".equals(correctAnswers.get("answer_d_correct").asText())) letraCorreta = "answer_d";

            // Pega o texto da resposta certa
            JsonNode answers = q.get("answers");
            String textoRespostaCorreta = answers.get(letraCorreta).asText();

            // Monta o JSON manualmente para não precisar de classes extras
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"prompt\": \"").append(limparTexto(pergunta)).append("\",");
            json.append("\"correctAnswer\": \"").append(limparTexto(textoRespostaCorreta)).append("\",");
            json.append("\"options\": [");

            // Adiciona as opções válidas (remove as nulas)
            List<String> optionsJson = new ArrayList<>();
            addOptionIfValid(optionsJson, answers, "answer_a", letraCorreta);
            addOptionIfValid(optionsJson, answers, "answer_b", letraCorreta);
            addOptionIfValid(optionsJson, answers, "answer_c", letraCorreta);
            addOptionIfValid(optionsJson, answers, "answer_d", letraCorreta);

            json.append(String.join(",", optionsJson));
            json.append("]}");

            return json.toString();

        } catch (Exception e) {
            return fallback("Erro ao traduzir questão.");
        }
    }

    private void addOptionIfValid(List<String> list, JsonNode answers, String key, String correctKey) {
        if (answers.has(key) && !answers.get(key).isNull()) {
            String text = limparTexto(answers.get(key).asText());
            boolean isCorrect = key.equals(correctKey);
            list.add(String.format("{\"text\": \"%s\", \"correct\": %b}", text, isCorrect));
        }
    }

    private String limparTexto(String text) {
        if (text == null) return "";
        return text.replace("\"", "'").replace("\n", " ").trim();
    }

    private String fallback(String msg) {
        return "{\n" +
                "  \"prompt\": \"" + msg + " Qual a saída de: console.log('Oi')?\",\n" +
                "  \"correctAnswer\": \"Oi\",\n" +
                "  \"options\": [\n" +
                "    {\"text\": \"Erro\", \"correct\": false},\n" +
                "    {\"text\": \"Oi\", \"correct\": true},\n" +
                "    {\"text\": \"Undefined\", \"correct\": false}\n" +
                "  ]\n" +
                "}";
    }
}