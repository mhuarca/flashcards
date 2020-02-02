package com.huarca.spring.mapper;

import java.util.List;

import com.huarca.spring.model.Card;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * CardMapper
 */
@Mapper
public interface CardMapper {

    void insert(@Param("card") Card card, @Param("deckId") int deckId);

    void update(@Param("card") Card card);

    List<Card> findAllByDeckId(@Param("deckId") int deckId);
}