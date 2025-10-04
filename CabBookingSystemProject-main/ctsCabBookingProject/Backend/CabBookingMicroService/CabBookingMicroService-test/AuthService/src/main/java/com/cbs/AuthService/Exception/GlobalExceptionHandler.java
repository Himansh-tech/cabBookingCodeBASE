package com.cbs.AuthService.Exception;//package com.cbs.User.Exceptions;
 // Or a more appropriate package for your exception handlers

import com.cbs.AuthService.AuthDto.ApiResponseDto;
import com.cbs.AuthService.Exception.Exception.IncorrectPasswordException;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DoesNotExistException.class)
    public ResponseEntity<ErrorResponse> handleDoesNotExistException(
            DoesNotExistException ex, WebRequest request) {


        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(AlreadyExistException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyException(AlreadyExistException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
   @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<ErrorResponse> handlePasswordIncorrectException(IncorrectPasswordException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {

         ErrorResponse errorResponse = new ErrorResponse(
                "Invalid username or password. Please try again.", // Generic and secure message
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()

        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Object> handleFeignExceptions(FeignException ex) {
        // Log the full FeignException details here for debugging
        System.err.println("Auth Service Feign Exception Handler: " + ex.status() + " - " + ex.getMessage());
        System.err.println("Auth Service Feign Exception Content: " + ex.contentUTF8());

        // For production, consider sanitizing `ex.contentUTF8()`
        return ResponseEntity.status(ex.status())
                .contentType(MediaType.APPLICATION_JSON)
                .body(ex.contentUTF8());
    }


}