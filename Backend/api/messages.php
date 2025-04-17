<?php
require_once '../db/connection.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Obtener mensajes de una conversación
    $conversationId = $_GET['conversation_id'] ?? null;

    if (!$conversationId) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta conversation_id']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT content, sender, created_at as timestamp
        FROM messages
        WHERE conversation_id = :id
        ORDER BY created_at ASC
    ");
    $stmt->execute(['id' => $conversationId]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    // Guardar mensaje nuevo
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['conversation_id'], $data['content'], $data['sender'])) {
        echo json_encode(['error' => 'Faltan campos obligatorios']);
        http_response_code(400);
        exit;
    }

    // Crear conversación si no existe
    $stmt = $pdo->prepare("INSERT IGNORE INTO conversations (id) VALUES (:id)");
    $stmt->execute(['id' => $data['conversation_id']]);

    // Insertar mensaje
    $stmt = $pdo->prepare("
        INSERT INTO messages (conversation_id, content, sender, is_agent_request)
        VALUES (:id, :content, :sender, :is_agent)
    ");
    $stmt->execute([
        'id' => $data['conversation_id'],
        'content' => $data['content'],
        'sender' => $data['sender'],
        'is_agent' => $data['is_agent_request'] ?? false
    ]);

    echo json_encode(['status' => 'success']);
    exit;
}

// Método no permitido
http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
