package com.pvzzombs.simplelogintodoapp.backend_java.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.repository.SessionsRepository;

@Service
public class SessionsService {
  private final SessionsRepository sessionsRepository;

  public SessionsService(SessionsRepository sessionsRepository) {
    this.sessionsRepository = sessionsRepository;
  }

  public Sessions getSessionById(String id) {
    Optional<Sessions> s = sessionsRepository.findById(id);
    if (s.isPresent()) {
      return s.get();
    }
    return null;
  }

  public Sessions createSession(Sessions s) {
    return sessionsRepository.save(s);
  }

  public void deleteSession(String id) {
    sessionsRepository.deleteById(id);
  }
}
