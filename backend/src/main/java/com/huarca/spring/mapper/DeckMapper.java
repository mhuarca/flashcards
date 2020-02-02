package com.huarca.spring.mapper;

import java.util.List;

import com.huarca.spring.model.DeckMetadata;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * DeckMapper
 */
@Mapper
public interface DeckMapper {

    void insert(@Param("deck") DeckMetadata deckMetadata);

    DeckMetadata findById(@Param("id") int id);

    DeckMetadata findByUserAndTitle(@Param("userId") String userId, @Param("title") String title);

    List<DeckBuilder> findDecksByUser(@Param("userId") String userId);
}