<?php
require_once '../db/connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$ids = $data['ids'] ?? [];

if (!is_array($ids) || count($ids) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'No se proporcionaron IDs']);
    exit;
}

// Armar placeholders (?, ?, ?) para la consulta
$placeholders = implode(',', array_fill(0, count($ids), '?'));

try {
    $stmt = $pdo->prepare("DELETE FROM conversations WHERE id IN ($placeholders)");
    $stmt->execute($ids);

    echo json_encode(['status' => 'success', 'deleted' => count($ids)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
