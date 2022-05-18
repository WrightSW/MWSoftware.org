//
// RETest.js
//
// Developer: Michael Wright
// License: CC BY 3.0 http://creativecommons.org/licenses/by/3.0/
// Copyright 2021, 2022 Michael Wright
//


// One of the eval flag was changed on the form
function eventEvalFlagChange( form ) {
    if (form.chkboxAutoEval.checked == true ) {
        evaluateRegEx(form);
    }
}

function eventAutoEvalChange(form) {
    if (form.chkboxAutoEval.checked == true ) {
        form.buttonEval.disabled = true;
    }
    else {
        form.buttonEval.disabled = false;
    }
}

function actionNewInput(form) {
    if (form.chkboxAutoEval.checked == true ) {
        evaluateRegEx(form);
    }
}

function actionBtnEvaluate( form) {
    evaluateRegEx( form );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function evaluateRegEx(form) {
    var iFlag = "";
    var gFlag = "";
    var reFlags = "";
    if (form.chkboxGlobal.checked == true) {
        reFlags = gFlag + "g";
    }
    if (form.chkboxCaseInsensitive.checked == true) {
        reFlags = iFlag + "i";
    }
    var reFlags = reFlags + gFlag + iFlag;
    // Debug
    console.debug("Debug: Flags = " + reFlags);
    
    var preCheckResult = "";
    var pattern;
    var patternNonGlobal;   // Second instance for sub-expression breakout
    //var inputRegexStr = escapeRegExp( form.inputRegEx.value );
    var inputRegexStr = form.inputRegEx.value;
    // Debug
    console.debug("Debug: inputRegexStr = " + inputRegexStr);
    if (inputRegexStr.length == 0) {
        preCheckResult = "[Reg. Exp. is zero length]\n\n";
    }
        
    else {
        try {
            if (reFlags.length == 0) {
                console.debug("Degug: RegExp no-flags call.");
                pattern = new RegExp(form.inputRegEx.value);
                patternNonGlobal = new RegExp(form.inputRegEx.value);
            }
            else {
                console.debug("Degug: RegExp call using reFlags=" + reFlags);
                pattern = new RegExp(form.inputRegEx.value, reFlags);
                patternNonGlobal = new RegExp(form.inputRegEx.value, iFlag);
            }
        }
        catch (ex) {
            preCheckResult = preCheckResult + "[Reg. Exp. is incomplete or invalid]\n\n";
        }
    }
    var text = form.inputTestText.value;
    if (text.length == 0) {
        preCheckResult = preCheckResult + "[Test String is zero length]\n\n";
    }
    if (preCheckResult.length > 0) {
        form.results.value = preCheckResult;
        return;
    }

    //if ((pattern == NULL) !! (text.length == 0)) {
    //    form.results.value = "[Incomplete input]";
    //    return;
    //}
    //form.results.value = pattern + text;
    var result = [];
    var output = "";
    while ((result = pattern.exec(text)) != null) {
        output = output + "Matched: " + result[0] +
            "   \tat position " + result.index + "\n";
        var expandedResults;    // returned array
        var savedLastIndex = pattern.lastIndex;     // Save lastIndex property
        if ( (expandedResults = result[0].match(patternNonGlobal)) != null) {
            //if (expandedResults.length > 1) {
            for (var i=1; i < expandedResults.length; i++) {
                output = output + "   \t$" + i + " = " + expandedResults[i] + "\n"
            }
            //}
        }
        pattern.lastIndex = savedLastIndex;     // restore lastIndex property
        // case for non-global match
        if (pattern.lastIndex == 0) break;
    }
    if(output.length == 0) {
        form.results.value = "[No Match]";
    }
    else {
        form.results.value = output;
    }
    //form.results.value = pattern + text;
}
