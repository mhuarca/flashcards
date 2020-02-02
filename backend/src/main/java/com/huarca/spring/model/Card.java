package com.huarca.spring.model;

import java.io.Serializable;


public class Card implements Serializable {
    private static final long serialVersionUID = 1L;

    private final int id;
    private final int order;
    private final String question;
    private final String answer;

    public Card(int id, int order, String question, String answer) {
        this.id = id;
        this.order = order;
        this.question = question;
        this.answer = answer;
    }

    public int getId() {
        return id;
    }

    public int getOrder() {
        return order;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }
}