<?php
$post_data = file_get_contents('php://input');
print_r($post_data);
// the directory "data" must be writable by the server
$name = "changelog.txt";
$data = $post_data;
// write the file to disk
file_put_contents($name, $data, FILE_APPEND);
?>