<?php
require_once '../db/connection.php';
header('Content-Type: application/json');

$sql = "
SELECT 
    c.id,
    c.status,
    MAX(m.created_at) as last_message_time,
    (
        SELECT content FROM messages 
        WHERE conversation_id = c.id 
        ORDER BY created_at DESC 
        LIMIT 1
    ) as last_message
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id
ORDER BY last_message_time DESC
LIMIT 50
";

$stmt = $pdo->query($sql);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
