package com.huarca.spring.services;

import java.util.List;
import java.util.Optional;

import com.huarca.spring.model.Card;
import com.huarca.spring.model.Deck;

import org.springframework.stereotype.Repository;

/**
 * FlashcardsRepository
 */
@Repository
public interface FlashcardsRepository {

    void save(Deck deck);

    void updateOrInsertCards(List<Card> cards, Integer deckId);

    Optional<Deck> findDeckById(int id);

    Optional<Deck> findDeckByUserAndTitle(String userId, String title);

    List<Deck> getDecksForUser(String userId);
}