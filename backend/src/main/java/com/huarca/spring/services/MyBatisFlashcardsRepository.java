package com.huarca.spring.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.huarca.spring.mapper.CardMapper;
import com.huarca.spring.mapper.DeckBuilder;
import com.huarca.spring.mapper.DeckMapper;
import com.huarca.spring.model.Card;
import com.huarca.spring.model.Deck;
import com.huarca.spring.model.DeckMetadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * MyBatisFlashcardsRepository
 */
@Repository
public class MyBatisFlashcardsRepository implements FlashcardsRepository {
    private final DeckMapper deckMapper;
    private final CardMapper cardMapper;
    private final TransactionTemplate transactionTemplate;

    @Autowired
    public MyBatisFlashcardsRepository(DeckMapper deckMapper, CardMapper cardMapper,
            PlatformTransactionManager transactionManager) {
        this.deckMapper = deckMapper;
        this.cardMapper = cardMapper;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @Override
    public void save(Deck deck) {
        DeckMetadata deckMetadata = new DeckMetadata(deck.getId(), deck.getUserId(), deck.getTitle(),
                deck.getCategory());
        deckMapper.insert(deckMetadata);
    }

    @Override
    public void updateOrInsertCards(List<Card> cards, Integer deckId) {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                // Get existing Cards for Deck ID, so we know to update vs. insert.
                List<Card> existingCards = cardMapper.findAllByDeckId(deckId);
                int[] cardIds = new int[existingCards.size()];
                for (int i = 0; i < existingCards.size(); i++) {
                    cardIds[i] = existingCards.get(i).getId();
                }
                Arrays.sort(cardIds);
                try {
                    for (Card cardToUpdate : cards) {
                        if (Arrays.binarySearch(cardIds, cardToUpdate.getId()) < 0) {
                            // ID doesn't exist this must be a new insert:
                            cardMapper.insert(cardToUpdate, deckId);
                        } else {
                            // ID exists, so this is an update:
                            cardMapper.update(cardToUpdate);
                        }
                    }
                } catch (Exception e) {
                    status.setRollbackOnly();
                    throw e;
                }
            }
        });
    }

    @Override
    public Optional<Deck> findDeckById(int id) {
        Optional<Deck> optionalDeck = Optional.empty();
        Optional<DeckMetadata> optionalDeckMetadata = Optional.ofNullable(deckMapper.findById(id));
        if (optionalDeckMetadata.isPresent()) {
            optionalDeck = buildDeckFromDeckMetadata(optionalDeckMetadata.get());
        }
        return optionalDeck;
    }

    @Override
    public Optional<Deck> findDeckByUserAndTitle(String userId, String title) {
        Optional<Deck> optionalDeck = Optional.empty();
        Optional<DeckMetadata> optionalDeckMetadata = Optional.ofNullable(deckMapper.findByUserAndTitle(userId, title));
        if (optionalDeckMetadata.isPresent()) {
            optionalDeck = buildDeckFromDeckMetadata(optionalDeckMetadata.get());
        }
        return optionalDeck;
    }

    private Optional<Deck> buildDeckFromDeckMetadata(DeckMetadata deckMetadata) {
        int deckId = deckMetadata.getId();
        Optional<List<Card>> optionalCards = Optional.ofNullable(cardMapper.findAllByDeckId(deckId));
        List<Card> cards = new ArrayList<>();
        if (optionalCards.isPresent()) {
            cards = optionalCards.get();
        }
        return Optional.of(new Deck(deckMetadata, cards));
    }

    @Override
    public List<Deck> getDecksForUser(String userId) {
        List<DeckBuilder> deckBuilders = deckMapper.findDecksByUser(userId);
        List<Deck> decks = new ArrayList<>();
        for (DeckBuilder builder : deckBuilders) {
            Deck newDeck = builder.build();
            decks.add(newDeck);
        }
        return decks;
    }
}