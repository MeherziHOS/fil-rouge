<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (
    !isset($_SESSION["id_client"]) ||
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {
    http_response_code(403);
    exit("Accès interdit");
}