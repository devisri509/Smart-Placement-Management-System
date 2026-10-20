package com.placement.system.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeFlexibleDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateStr = p.getText();
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }
        dateStr = dateStr.trim();
        try {
            if (dateStr.length() == 10) { // e.g. "2026-12-31" from HTML date input
                LocalDate localDate = LocalDate.parse(dateStr, DATE_FORMATTER);
                return localDate.atTime(23, 59, 59);
            }
            if (dateStr.endsWith("Z")) {
                dateStr = dateStr.substring(0, dateStr.length() - 1);
            }
            return LocalDateTime.parse(dateStr);
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception ex) {
                throw ctxt.weirdStringException(dateStr, LocalDateTime.class, "Failed to parse date/time string: " + dateStr);
            }
        }
    }
}
