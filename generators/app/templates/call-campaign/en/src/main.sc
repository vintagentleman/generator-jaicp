require: slotfilling/slotFilling.sc
    module = sys.zb-common

init:
    bind("postProcess", function(ctx) {
        ctx.response.bargeIn = {
            bargeIn: "forced",
            bargeInTrigger: "interim",
            noInterruptTime: 0
        };
    });

theme: /

    state: Start
        q!: $regex</start>
        script:
            $jsapi.startSession();
            $session.userName = $dialer.getPayload().name || "stranger";
            $dialer.setCallResult("Greeting");
        a: Hello, {{$session.userName}}!
        a: Due to the COVID-19 pandemic, the world government is concerned for your safety.
        go!: /Symptoms

    state: Symptoms
        a: Have you recently found yourself with a fever, a dry cough, or a rapid tiredness?

        state: Positive
            intent: /Agree
            intent: /Sick
            a: Then do not put yourself in danger! Seek medical attention immediately!
            script:
                $dialer.reportData("Case", "Positive");
                $dialer.setCallResult("Known case");
            go!: /Goodbye

        state: Negative
            intent: /Disagree
            intent: /Healthy
            a: Good to hear everything is fine! Still, do not forget to wash your hands and wear face masks.
            script:
                $dialer.reportData("Case", "Negative");
                $dialer.setCallResult("Known case");
            go!: /Goodbye

        state: Unrecognized
            event!: noMatch
            a: So you say: {{$parseTree.text}}. Remember about proper hygiene and wearing face masks.
            script:
                $dialer.reportData("Case", $parseTree.text);
                $dialer.setCallResult("Known case");
            go!: /Goodbye

    state: Goodbye
        event!: hangup
        a: Goodbye and stay safe!
        script:
            $dialer.hangUp();

    state: Callback
        intent!: /Callback
        a: Okay, I’ll call you back later!
        script:
            $dialer.setCallResult("Callback request");
            $dialer.redial({startDateTime: new Date($parseTree._dateTime.timestamp)});
        go!: /Goodbye

    state: NoInput || noContext = true
        event!: speechNotRecognized
        script:
            $session.noInputCounter = $session.noInputCounter || 0;
            $session.noInputCounter++;
        if: $session.noInputCounter >= 3
            audio: https://example.com/comms-issue.wav
            script:
                $dialer.setCallResult("Bad connection");
            go!: /Goodbye
        else:
            a: I didn’t catch that. Could you repeat, please?
