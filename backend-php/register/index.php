<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");
header('Content-Type: application/json');

$methodMade = $_SERVER["REQUEST_METHOD"];

if ($methodMade === 'POST') {
  $json = file_get_contents('php://input');
  $data = json_decode($json, true);
  if (json_last_error() === JSON_ERROR_NONE) {
    $username = $data['username'] ?? null;
    $password = $data['password'] ?? null;
    if ($username == null || $password == null) {
      echo json_encode([
        'status' => 'failed',
        'message' => 'Some fields are empty'
      ]);
      return;
    }
    // no errors, continue
    $passwordHash = sodium_crypto_pwhash_str($password, SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE, SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE);
    $db = new SQLite3('../test.db');
    $stm = $db->prepare('select username from users where username = ?');
    $stm->bindValue(1, $username, SQLITE3_TEXT);
    $res = $stm->execute();
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
      echo json_encode([
        'status' => 'failed',
        'message' => 'User already exists'
      ]);
      return;
    }
    // insert into database
    $stm2 = $db->prepare('insert into users(username, password) values (?, ?)');
    $stm2->bindValue(1, $username, SQLITE3_TEXT);
    $stm2->bindValue(2, $passwordHash, SQLITE3_TEXT);
    $stm2->execute();
    echo json_encode([
      'status' => 'success',
      'message' => 'User registered successfully'
    ]);
    return;
  } else {
    echo json_encode([
      'status' => 'failed',
      'message' => 'JSON Error'
    ]);
    return;
  }
  echo json_encode([
    'status' => 'failed'
  ]);
}
?>