/**
 * Sets the Stop for a ticker prior to entering a trade
 */
function SetStop() {
    $montage = GetWindowObj("Montage");
    $stop = Round(GetWindowObj().GetMousePtPrice(), 2);

    if($montage.Ask > $stop) {
        $side = "long";
    } else {
        $side = "short";
    }

    Speak($side + "StopSet");

    // parameters must be referenced as global variables
    ExecHotkey("ShareCalc");

    DelVar("$side")
}

/**
 * Requires pre-defined $stop
 * Dynamic share calculator based on a pre-defined stop and an entry price
 * Returns share size of 1 if shares is 0
 */
function ShareCalc() {
    $tradeDollarRisk = 100;

    if($side == "long") {
        $riskStopDistanceEntry = $montage.Ask - $stop;
    } else {
        $riskStopDistanceEntry = $stop - $montage.Bid;
    }

    $riskMaxDollarAmt = $montage.BP * 0.97;
    $riskStopDistanceShares = $tradeDollarRisk / $riskStopDistanceEntry;
    $riskAbsALessB = Abs($riskMaxDollarAmt - $riskStopDistanceShares);
    $riskAPlusB = $riskMaxDollarAmt + $riskStopDistanceShares;
    $shareSize = 0.5 * ($riskAPlusB - $riskAbsALessB);

    if($shareSize < 1) {
        $shares = 1;
    } else {
        // rounds down when not providing a second param
        $shares = Round($shareSize);
    }

    // das cannot return variables. $shares is now the global variable containing the shares you would send an order with
    // place your execution logic here or somewhere else and be sure to clean up $shares after

    // cleanup variables
    DelVar("$montage", "$riskStopDistanceEntry","$riskMaxDollarAmt","$riskStopDistanceShares","$riskAbsALessB","$riskAPlusB", "$shareSize", "$stop", "$tradeDollarRisk");
}
