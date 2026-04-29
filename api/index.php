<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// MikroTik API Configuration
$api_url = "http://10.0.0.254/admin/api/generateVouchers";
$token   = "12345";

// Get parameters from URL query
$amt   = $_GET['amt']   ?? 1;
$pfx   = $_GET['pfx']   ?? 'VC';
$qty   = $_GET['qty']   ?? 1;
$sales = $_GET['sales'] ?? 0;
$print = $_GET['print'] ?? 0;

// Build POST data
$postData = http_build_query([
    'amt'   => $amt,
    'pfx'   => $pfx,
    'qty'   => $qty,
    'sales' => $sales,
    'print' => $print
]);

// Use cURL to make request
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-TOKEN: $token",
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$error    = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Return response
if ($error) {
    echo json_encode([
        'success' => false,
        'error'   => $error,
        'hint'    => 'Cannot connect to MikroTik at ' . $api_url
    ]);
} else {
    $data = json_decode($response, true);
    echo json_encode([
        'success'   => true,
        'http_code' => $httpCode,
        'data'      => $data ?? $response
    ]);
}
