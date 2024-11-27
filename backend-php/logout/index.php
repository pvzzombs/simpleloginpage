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
    $sessionid = $data['sessionid'] ?? null;
    if ($username == null || $sessionid == null) {
      echo json_encode([
        'status' => 'failed',
        'message' => 'Some fields are empty'
      ]);
      return;
    }
    $db = new SQLite3('../test.db');
    $stm = $db->prepare('select username, sessionid from sessions where username = ?');
    $stm->bindValue(1, $username, SQLITE3_TEXT);
    $res = $stm->execute();
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
      // verify password
      if (sodium_crypto_pwhash_str_verify($row['sessionid'], $sessionid)) {
        $stm2 = $db->prepare('delete from sessions where username = ?');
        $stm2->bindValue(1, $username, SQLITE3_TEXT);
        $stm2->execute();
        echo json_encode([
          'status' => 'success',
          'message' => 'Logged out successfully'
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