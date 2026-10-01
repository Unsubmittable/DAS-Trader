/**
 * Companion script for the "How I Use AI to Write DAS Trader Hotkeys" video: 
 * 
 * Panic button for whatever symbol is currently focused: cancels every open
 * order on it, then, if there's a position, sends one marketable order to
 * flatten it. Scoped to this symbol only - unlike DAS's global PANIC command,
 * it does not touch other symbols or accounts.
 *
 * Mirrors ExitPosition's conventions: side comes from $ticker.data.Side (so
 * $tickers must already have this symbol initialized, same requirement every
 * other exit hotkey has), and route selection is session-aware - market
 * during regular hours, an aggressive Bid/Ask limit pre/post-market, since
 * DAS won't route a market order outside 9:30-4:00. The limit fallback prices
 * at Bid (selling out of a long) or Ask (buying back a short) so it's
 * marketable rather than passive.
 */
function MontageFlattenSymbol() {
    $montage.Symbol = GetWindowObj().Symbol;
    $montage.CXL ALLSYMB;
    ExecHotkey("OptionsCancelOrder");

    if ($montage.Pos == 0) {
        return;
    }

    $ticker = $tickers.get($montage.Symbol);

    $flattenTime = GetSecond();
    // 9:30am - 4:00pm
    if (($flattenTime > 34200) && ($flattenTime < 57600)) {
        ExecHotkey("SetRouteMarket");
    } else {
        ExecHotkey("SetRouteLimit");
    }

    $montage.Share = Abs($montage.Pos);

    if ($ticker.data.Side == "long") {
        $montage.Price = $montage.Bid;
        $montage.SELL;
    } else {
        $montage.Price = $montage.Ask;
        $montage.BUY;
    }

    DelVar("$flattenTime", "$ticker");
}
