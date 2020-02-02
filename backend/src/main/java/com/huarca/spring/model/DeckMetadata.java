package com.huarca.spring.model;

import java.io.Serializable;

/**
 * A POJO for holding Deck Metadata, but does NOT include the associated Card
 * collection. Queries will be easier to manage with this container object.
 */
public class DeckMetadata implements Serializable {
    private static final long serialVersionUID = 1L;

    private final int id;
    private final String userId;
    private final String title;
    private final String category;

    public DeckMetadata(int id, String userId, String title, String category) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.category = category;
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

    public String getUserId() {
        return userId;
    }
}