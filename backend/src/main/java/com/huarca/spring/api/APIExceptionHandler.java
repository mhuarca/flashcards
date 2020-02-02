package com.huarca.spring.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.exceptions.IbatisException;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


/**
 * Handles all exceptions specifically thrown by controllers in the api package.
 */
@RestControllerAdvice(basePackages = "com.huarca.spring.api")
@Order(1000)
public class APIExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * API requests that failed input validation should end up here. 
     * We show the error for each field as an array of strings, and wrap that
     * in an "errors" entry in JSON. e.g.:
     * {"errors": {"email": ["must not be blank"]}}
     * @param ex
     * @param request
     * @return
     */
    @ExceptionHandler({InvalidAPIRequestException.class})
    public ResponseEntity<Object> handleBadInput(InvalidAPIRequestException ex, WebRequest request) {
        Map<String, Map<String, List<String>>> errorMap = new HashMap<>();
        Map<String, List<String>> errorDetailMap = new HashMap<>();
        for (FieldError fieldError : ex.getErrors().getFieldErrors()) {
            String fieldName = fieldError.getField();
            if (!errorDetailMap.containsKey(fieldName)) {
                errorDetailMap.put(fieldName, new ArrayList<String>());
            }
            errorDetailMap.get(fieldName).add(fieldError.getDefaultMessage());
        }
        errorMap.put("errors", errorDetailMap);
        return ResponseEntity.unprocessableEntity()
            .contentType(MediaType.APPLICATION_JSON)
            .body(errorMap);
    }

    /**
     * Handler for Database errors. This is returned under the generic "apiError" JSON property.
     * @param ex The database Exception
     * @param webRequest
     * @return a 500 error in JSON format with the error detail.
     */
    @ExceptionHandler({IbatisException.class})
    public ResponseEntity<Object> handleIbatisDbError(IbatisException ex, WebRequest webRequest) {
        return formatApiServerError(ex);
    }

    @ExceptionHandler({DataAccessException.class})
    public ResponseEntity<Object> handleJDBCError(DataAccessException ex, WebRequest webRequest) {
        return formatApiServerError(ex);
    }

    private ResponseEntity<Object> formatApiServerError(RuntimeException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("apiError", ex.getMessage());
        return ResponseEntity.status(500)
            .contentType(MediaType.APPLICATION_JSON)
            .body(errorMap);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
            HttpStatus status, WebRequest request) {     
        ex.printStackTrace();
                // TODO Auto-generated method stub
        return super.handleExceptionInternal(ex, body, headers, status, request);
    }
}