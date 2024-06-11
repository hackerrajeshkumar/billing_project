<?php
$caid = $_POST['caid'];
$payDate = $_POST['payDate'];

$bills = json_decode(file_get_contents('bills.json'), true);

foreach ($bills as $key => &$bill) {
    if ($bill['caid'] === $caid) {
        foreach ($bill['payments'] as $paymentKey => $payment) {
            if ($payment['payDate'] === $payDate) {
                unset($bill['payments'][$paymentKey]);
                $bill['payments'] = array_values($bill['payments']);
                if (empty($bill['payments'])) {
                    unset($bills[$key]);
                }
                break 2;
            }
        }
    }
}

$bills = array_values($bills);
file_put_contents('bills.json', json_encode($bills, JSON_PRETTY_PRINT));
echo 'success';
?>