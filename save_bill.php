<?php
$name = $_POST['name'];
$caid = $_POST['caid'];
$opDbm = $_POST['opDbm'];
$payDate = $_POST['payDate'];
$nextDueDate = $_POST['nextDueDate'];
$price = $_POST['price'];
$bills = json_decode(file_get_contents('bills.json'), true);
$duplicateCaid = false;
foreach ($bills as $bill) {
    if ($bill['caid'] === $caid && $bill['name'] !== $name) {
        $duplicateCaid = true;
        break;
    }
}
if ($duplicateCaid) {
    echo 'duplicate';
} else {
    $newBill = [
        'name' => $name,
        'caid' => $caid,
        'opDbm' => $opDbm,
        'payments' => [
            [
                'payDate' => $payDate,
                'nextDueDate' => $nextDueDate,
                'price' => $price
            ]
        ]
    ];
    $billExists = false;
    foreach ($bills as &$bill) {
        if ($bill['caid'] === $caid) {
            $bill['payments'][] = [
                'payDate' => $payDate,
                'nextDueDate' => $nextDueDate,
                'price' => $price
            ];
            $billExists = true;
            break;
        }
    }

    if (!$billExists) {
        $bills[] = $newBill;
    }

    file_put_contents('bills.json', json_encode($bills, JSON_PRETTY_PRINT));
    echo 'success';
}
?>