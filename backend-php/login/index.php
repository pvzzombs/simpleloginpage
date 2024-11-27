<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");
header('Content-Type: application/json');

$methodMade = $_SERVER["REQUEST_METHOD"];

function uuidv4()
{
  $data = random_bytes(16);

  $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

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
    // check session
    $db = new SQLite3('../test.db');
    $stm = $db->prepare('select username from sessions where username = ?');
    $stm->bindValue(1, $username, SQLITE3_TEXT);
    $res = $stm->execute();
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
      echo json_encode([
        'status' => 'failed',
        'message' => 'User already logged in'
      ]);
      return;
    }
    // proceed to login
    $db = new SQLite3('../test.db');
    $stm = $db->prepare('select username, password from users where username = ?');
    $stm->bindValue(1, $username, SQLITE3_TEXT);
    $res = $stm->execute();
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
      // verify password
      if (sodium_crypto_pwhash_str_verify($row['password'], $password)) {
        $newUUID = uuidv4();
        $newUUIDHash = sodium_crypto_pwhash_str($newUUID, SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE, SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE);
        $stm2 = $db->prepare('insert into sessions(username, sessionid) values (?, ?)');
        $stm2->bindValue(1, $username, SQLITE3_TEXT);
        $stm2->bindValue(2, $newUUIDHash, SQLITE3_TEXT);
        $stm2->execute();
        echo json_encode([
          'status' => 'success',
          'sessionid' => $newUUID,
          'message' => 'Logged in successfully'
        ]);
        return;
      }
    }
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