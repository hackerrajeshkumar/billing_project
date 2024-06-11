<?php
$bills = json_decode(file_get_contents('bills.json'), true);

$overduePayments = array();
foreach ($bills as $bill) {
    foreach ($bill['payments'] as $payment) {
        $dueDate = strtotime($payment['nextDueDate']);
        if ($dueDate < time()) {
            $overduePayment = array(
                'name' => $bill['name'],
                'caid' => $bill['caid'],
                'price' => $payment['price']
            );
            $overduePayments[] = $overduePayment;
        }
    }
}

echo json_encode($overduePayments);
?>