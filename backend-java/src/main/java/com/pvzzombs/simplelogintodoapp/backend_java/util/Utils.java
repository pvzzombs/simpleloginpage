package com.pvzzombs.simplelogintodoapp.backend_java.util;

public class Utils {
  public static String removeZeroesOnTheEnd(String input) {
    int end = input.length() - 1;
    while(end > 0 && input.charAt(end) == '\u0000') {
      end--;
    }
    return input.substring(0, end + 1);
  }
}
