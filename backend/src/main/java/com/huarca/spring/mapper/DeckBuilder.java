package com.huarca.spring.mapper;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.huarca.spring.model.Card;
import com.huarca.spring.model.Deck;

/**
 * Builds an immutable Deck. The builder is a one-off in that it will throw an
 * error if you try to call build() more than once.
 */
public class DeckBuilder implements Serializable {

    private static final long serialVersionUID = 1L;

    private boolean buildFinished = false;
    private boolean deckIdHasBeenSet = false;
    private int id;
    private String userId;
    private String title;
    private String category;
    private List<Card> cards;

    public Deck build() {
        if (buildFinished) {
            throw new IllegalArgumentException("This DeckBuilder instance has already been run.");
        }
        buildFinished = true;
        if (!deckIdHasBeenSet
                || userId == null
                || title == null
                || category == null) {
            throw new IllegalArgumentException("Could not build deck. Missing parameters.");
        }
        if (cards == null) {
            cards = new ArrayList<>();
        }
        return new Deck(id, userId, title, category, cards);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        deckIdHasBeenSet = true;
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }
}