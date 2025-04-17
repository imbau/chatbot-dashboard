<?php
require_once '../db/connection.php';
header('Content-Type: application/json');

$conversationId = $_GET['id'] ?? null;

if (!$conversationId) {
    echo json_encode(['error' => 'ID de conversación faltante']);
    http_response_code(400);
    exit;
}

$stmt = $pdo->prepare("UPDATE conversations SET status = 'human' WHERE id = :id");
$stmt->execute(['id' => $conversationId]);

echo json_encode(['status' => 'success']);
