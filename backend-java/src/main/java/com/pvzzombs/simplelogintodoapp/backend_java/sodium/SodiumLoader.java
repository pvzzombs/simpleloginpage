package com.pvzzombs.simplelogintodoapp.backend_java.sodium;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.goterl.lazysodium.SodiumJava;

public class SodiumLoader {
  public static SodiumJava sodium;
  private Logger logger; 

  public void loadSodiumJava() {
    sodium = new SodiumJava();
    logger = LoggerFactory.getLogger(SodiumLoader.class);
    logger.info("Sodium initialized...");
  }
}