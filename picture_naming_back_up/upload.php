<?php 
    // gets entire POST body
    //$data = file_get_contents('php://input');
    // write the data out to the file
    
	print_r($_REQUEST);
	print_r($_FILES);

	$data = file_get_contents($_FILES['audio']['tmp_name']);	

    $fp = fopen("saved_audio/" . $_REQUEST["name"] . '.webm', 'wb');

    fwrite($fp, $data);
    fclose($fp);
?>

