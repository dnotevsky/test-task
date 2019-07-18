<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';


/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Sheets API PHP Quickstart');
    $client->setScopes(Google_Service_Sheets::SPREADSHEETS);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');


    $tokenPath = 'token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    
    return $client;
}


$client = getClient();
$service = new Google_Service_Sheets($client);

$spreadsheetId = '1rqX5J-89BlXulxKN9qkrKoZELxVErdr0nqTWMgGoO7E';
if(!empty($_POST['user_name']) && !empty($_POST['user_email'])){


    $body = new Google_Service_Sheets_ValueRange([
        'values' => [[$_POST['user_name'], $_POST['user_email']]]
    ]);
    $range = "A1:E";

    $conf = ["valueInputOption" => "RAW"];
    $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $conf);
    http_response_code(200);
} else {
    http_response_code(500);
}
?>