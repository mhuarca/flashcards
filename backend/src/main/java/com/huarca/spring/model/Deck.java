package com.huarca.spring.model;

import java.io.Serializable;
import java.util.List;


/**
 * A flashcard Deck has many Cards.
 */
public class Deck implements Serializable {
    private static final long serialVersionUID = 1L;

    private final int id;
    private final String userId;
    private final String title;
    private final String category;
    private final List<Card> cards;

    public Deck(int id, String userId, String title, String category, List<Card> cards) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.category = category;
        this.cards = cards;
    }

    public Deck(DeckMetadata deckMetadata, List<Card> cards) {
        this.id = deckMetadata.getId();
        this.userId = deckMetadata.getUserId();
        this.title = deckMetadata.getTitle();
        this.category = deckMetadata.getCategory();
        this.cards = cards;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public List<Card> getCards() {
        return cards;
    }

    public String getUserId() {
        return userId;
    }
}