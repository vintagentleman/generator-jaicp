require: slotfilling/slotFilling.sc
    module = sys.zb-common

theme: /

    state: Start
        q!: $regex</start>
        a: Let’s begin.

    state: Hello
        intent!: /hello
        a: Hello there!

    state: Bye
        intent!: /bye
        a: Bye bye!

    state: NoMatch
        event!: noMatch
        a: I didn’t get it. You said: {{$request.query}}

    state: Match
        event!: match
        a: {{$context.intent.answer}}
