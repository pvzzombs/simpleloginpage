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
    $todoItem = $data['item'] ?? null;
    $todoID = $data['id'] ?? null;
    $todoIsDone = $data['isDone'] ?? null;
    if ($username == null || $sessionid == null) {
      echo json_encode([
        'status' => 'failed',
        'message' => 'Some fields are empty'
      ]);
      return;
    }
    $db = new SQLite3('../../test.db');
    $stm = $db->prepare('select username, sessionid from sessions where username = ?');
    $stm->bindValue(1, $username, SQLITE3_TEXT);
    $res = $stm->execute();
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
      // verify password
      if (sodium_crypto_pwhash_str_verify($row['sessionid'], $sessionid)) {
        $stm2 = $db->prepare('insert into todo(username, item, id, isDone) values(?, ?, ?, ?)');
        $stm2->bindValue(1, $username, SQLITE3_TEXT);
        $stm2->bindValue(2, $todoItem, SQLITE3_TEXT);
        $stm2->bindValue(3, $todoID, SQLITE3_TEXT);
        $stm2->bindValue(4, $todoIsDone, SQLITE3_TEXT);
        $stm2->execute();
        echo json_encode([
          'status' => 'success',
          'message' => 'Insert successful'
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