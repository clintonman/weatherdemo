<?php
// setup cron job like so: php -q NO_GIT..../mycrontest.php
//php5 might need: /usr/local/php5/bin/php-cgi
//or plain php: /usr/local/bin/php

date_default_timezone_set('America/Los_Angeles');

$datestamp = date("Y-m-d h:i:sa");
$version = phpversion();
$to = "me@my_email.com";      // Email address to send 
$from = "custserv@clintons3d.com";      // Email address message will show as coming from.
$subject = "Cron test";      // Subject of email
$message = "Cron job test run at $datestamp \r\n";
$message .= "PHP Version $version";
$headers = "From: $from";
$content = $message;

mail($to, $subject, $content, $headers);
?>