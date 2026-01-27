package com.duolingo.clone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GeminiService {

    @Value("${quizapi.url}")
    private String apiUrl;

    @Value("${quizapi.key}")
    private String apiKey;

    public String gerarExercicio(String tema) {
        try {
            System.out.println("🐧 BMO: Buscando 8 questões sobre JavaScript...");

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Api-Key", apiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // MUDANÇA 1: Pedimos 8 questões de uma vez
            String finalUrl = apiUrl + "?limit=8&tags=JavaScript";

            ResponseEntity<String> response = restTemplate.exchange(finalUrl, HttpMethod.GET, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // MUDANÇA 2: Criamos uma lista de exercícios, não só um
            ObjectNode resultJson = mapper.createObjectNode();
            ArrayNode exercisesArray = mapper.createArrayNode();

            if (root.isArray()) {
                for (JsonNode questaoOriginal : root) {
                    exercisesArray.add(converterQuestao(questaoOriginal, mapper));
                }
            }

            // Retorna o JSON no formato que o Exercise do Java espera (mas como JSON String)
            // O frontend vai receber isso dentro de "exercises"
            return exercisesArray.toString();

        } catch (Exception e) {
            System.err.println("⚠️ Erro na QuizAPI: " + e.getMessage());
            return fallback();
        }
    }

    private JsonNode converterQuestao(JsonNode q, ObjectMapper mapper) {
        ObjectNode novoJson = mapper.createObjectNode();

        String pergunta = q.get("question").asText();
        // Tenta pegar a explicação da API. Se for null, cria uma genérica.
        String explicacao = q.has("explanation") && !q.get("explanation").isNull()
                ? q.get("explanation").asText()
                : "Resposta correta baseada na sintaxe padrão do JavaScript.";

        // Descobre a resposta certa
        JsonNode correctAnswers = q.get("correct_answers");
        String letraCorreta = null;
        if ("true".equals(correctAnswers.get("answer_a_correct").asText())) letraCorreta = "answer_a";
        else if ("true".equals(correctAnswers.get("answer_b_correct").asText())) letraCorreta = "answer_b";
        else if ("true".equals(correctAnswers.get("answer_c_correct").asText())) letraCorreta = "answer_c";
        else if ("true".equals(correctAnswers.get("answer_d_correct").asText())) letraCorreta = "answer_d";

        JsonNode answers = q.get("answers");
        String textoRespostaCorreta = answers.get(letraCorreta).asText();

        novoJson.put("prompt", limparTexto(pergunta));
        novoJson.put("correctAnswer", limparTexto(textoRespostaCorreta));
        novoJson.put("explanation", limparTexto(explicacao)); // NOVO CAMPO!

        ArrayNode optionsArray = mapper.createArrayNode();
        addOptionIfValid(optionsArray, answers, "answer_a", letraCorreta, mapper);
        addOptionIfValid(optionsArray, answers, "answer_b", letraCorreta, mapper);
        addOptionIfValid(optionsArray, answers, "answer_c", letraCorreta, mapper);
        addOptionIfValid(optionsArray, answers, "answer_d", letraCorreta, mapper);

        novoJson.set("options", optionsArray);
        return novoJson;
    }

    private void addOptionIfValid(ArrayNode list, JsonNode answers, String key, String correctKey, ObjectMapper mapper) {
        if (answers.has(key) && !answers.get(key).isNull()) {
            ObjectNode opt = mapper.createObjectNode();
            opt.put("text", limparTexto(answers.get(key).asText()));
            opt.put("correct", key.equals(correctKey));
            list.add(opt);
        }
    }

    private String limparTexto(String text) {
        if (text == null) return "";
        return text.replace("\"", "'").replace("\n", " ").trim();
    }

    private String fallback() {
        return "[{\n" +
                "  \"prompt\": \"(Offline) Qual comando imprime no console?\",\n" +
                "  \"correctAnswer\": \"console.log()\",\n" +
                "  \"explanation\": \"console.log é a função padrão para saída de debug.\",\n" +
                "  \"options\": [\n" +
                "    {\"text\": \"print()\", \"correct\": false},\n" +
                "    {\"text\": \"console.log()\", \"correct\": true}\n" +
                "  ]\n" +
                "}]";
    }
}