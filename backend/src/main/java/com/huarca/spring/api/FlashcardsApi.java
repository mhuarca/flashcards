package com.huarca.spring.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.huarca.spring.model.Card;
import com.huarca.spring.model.Deck;
import com.huarca.spring.model.User;
import com.huarca.spring.services.FlashcardsRepository;
import com.huarca.spring.services.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * FlashcardsApi
 */
@RestController
@RequestMapping(path = "/api")
public class FlashcardsApi {

    private final JwtService jwtService;
    private final FlashcardsRepository flashcardsRepository;
    private final AtomicInteger deckCounter = new AtomicInteger(1000);

    @Autowired
    public FlashcardsApi(JwtService jwtService, 
                         FlashcardsRepository flashcardsRepository) {
        this.jwtService = jwtService;
        this.flashcardsRepository = flashcardsRepository;
    }

    @PostMapping(path = "/decks", produces = "application/json")
    public ResponseEntity<Map<String, Object>> createDeck(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DeckCreationData deckCreationData,
            BindingResult bindingResult) {
        checkBindingResult(bindingResult);
        String userId = getUserIdFromPrincipal(user);

        // Check if user already has a Deck with this title (title's must be unique)
        Optional<Deck> optionalDeck = flashcardsRepository.findDeckByUserAndTitle(userId, deckCreationData.getTitle());
        if (optionalDeck.isPresent()) {
            bindingResult.rejectValue("title", "DUPLICATED", "Deck title already in use.");
            throw new InvalidAPIRequestException(bindingResult);
        }
        
        // Otherwise create new deck.
        int nextDeckId = deckCounter.incrementAndGet();
        Deck newDeck = new Deck(
            nextDeckId,
            userId,
            deckCreationData.getTitle(),
            deckCreationData.getCategory(),
            new ArrayList<Card>());
        flashcardsRepository.save(newDeck);
        return ResponseEntity.status(201).body(generateDeckResponse(newDeck));
    }

    @GetMapping(path = "/decks")
    public ResponseEntity<Map<String,Object>> getAllDecks(@AuthenticationPrincipal User user) {
        String userId = getUserIdFromPrincipal(user);
        List<Deck> decks = flashcardsRepository.getDecksForUser(userId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("decks", decks);
        return ResponseEntity.status(200).body(responseData);
    }

    @GetMapping(path = "/decks/{id}")
    public ResponseEntity<Map<String,Object>> getDeck(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Integer id) {
        String userId = getUserIdFromPrincipal(user);
        Optional<Deck> optionalDeck = flashcardsRepository.findDeckById(id);
        // If optional deck ID not found in database, OR user not associated with that deck ID, return 404.
        if (!optionalDeck.isPresent() || !optionalDeck.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(null);
        }
        Map<String, Object> deckResponse = new HashMap<>();
        deckResponse.put("deck", optionalDeck.get());
        return ResponseEntity.status(200).body(deckResponse);
    }

    @PostMapping(path = "/decks/updateRows")
    public ResponseEntity<Map<String,Object>> updateRows(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateRowsData updateRowsData,
            BindingResult bindingResult) {
        checkBindingResult(bindingResult);
        
        // If target deck does not exist, throw error.
        Optional<Deck> optionalDeck = flashcardsRepository.findDeckById(updateRowsData.getDeckId());
        if (!optionalDeck.isPresent()) {
            return getAPIErrorResponse(404, "Could not find deck to update.");
        }

        // If authenticated user does not match deck owner, throw 403.
        Deck targetDeck = optionalDeck.get();
        String userId = getUserIdFromPrincipal(user);
        if (!targetDeck.getUserId().equals(userId)) {
            return getAPIErrorResponse(403, "User not authorized for this deck");
        }

        // Now try updating the deck rows in the database.
        List<Card> cardsToUpdate = new ArrayList<>();
        for (CardEntry cardEntry : updateRowsData.getCards()) {
            int cardId = -1;
            try {
                cardId = Integer.valueOf(cardEntry.getId());
            } catch (NumberFormatException e) {
                // Ignore, leave cardId as -1, which means this is a 'New' row.
            }

            Card editedCard = new Card(
                cardId,
                -1, // order doesn't matter during update
                cardEntry.getQuestion(),
                cardEntry.getAnswer()
            );
            cardsToUpdate.add(editedCard);
        }
        flashcardsRepository.updateOrInsertCards(cardsToUpdate, updateRowsData.getDeckId());
        return ResponseEntity.status(200).body(null);
    }

    private void checkBindingResult(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new InvalidAPIRequestException(bindingResult);
        }
    }

    private String getUserIdFromPrincipal(User user) {
        String userId = "GUEST";
        if (user != null) {
            userId = user.getEmail();
        }
        return userId;
    }

    private Map<String, Object> generateDeckResponse(Deck deck) {
        Map<String, Object> deckResponse = new HashMap<>();
        deckResponse.put("created", deck);
        deckResponse.put("link", "/api/decks/" + deck.getId());
        return deckResponse;
    }

    private ResponseEntity<Map<String, Object>> getAPIErrorResponse(Integer code, String message) {
        Map<String, Object> responseObject = new HashMap<>();
        responseObject.put("apiError", "message");
        return ResponseEntity.status(code).body(responseObject);
    }

    /* ==================================== HELPER CLASSES ===================================== */

    @JsonRootName("deckData")
    public static class DeckCreationData {
        @NotBlank
        private String title;
        @NotBlank
        private String category;

        public DeckCreationData() {}

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
    }

    @JsonRootName("modifiedDeck")
    public static class UpdateRowsData {
        @NotNull
        private Integer deckId;
        @NotEmpty
        private List<CardEntry> cards;

        public Integer getDeckId() {
            return deckId;
        }

        public void setDeckId(Integer deckId) {
            this.deckId = deckId;
        }

        public List<CardEntry> getCards() {
            return cards;
        }

        public void setCards(List<CardEntry> cards) {
            this.cards = cards;
        }
    }

    public static class CardEntry {
        @NotBlank
        private String id;
        @NotBlank
        private String question;
        @NotBlank
        private String answer;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }
    }
}
