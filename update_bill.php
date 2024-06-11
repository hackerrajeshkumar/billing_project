<?php
$caid = $_POST['caid'];
$payDate = $_POST['payDate'];
$nextDueDate = $_POST['nextDueDate'];
$price = $_POST['price'];

$bills = json_decode(file_get_contents('bills.json'), true);

foreach ($bills as &$bill) {
    if ($bill['caid'] === $caid) {
        foreach ($bill['payments'] as &$payment) {
            if ($payment['payDate'] === $payDate) {
                $payment['nextDueDate'] = $nextDueDate;
                $payment['price'] = $price;
                break;
            }
        }
        break;
    }
}

file_put_contents('bills.json', json_encode($bills));
echo 'success';
?>