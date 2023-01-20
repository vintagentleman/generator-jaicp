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
            $session.userName = $dialer.getPayload().name || "незнакомец";
            $dialer.setCallResult("Приветствие");
        a: Приветствую вас, {{$session.userName}}!
        a: В связ+и с пандемией коронавируса, мировое правительство проводит информирование граждан.
        go!: /Симптомы

    state: Симптомы
        a: Скажите, наблюдаете ли вы за собой высокую температуру т+ела, сухой кашель, быструю утомляемость?

        state: Есть
            intent: /Согласие
            intent: /Болен
            a: В таком случае вам нужна срочная медицинская помощь! Немедленно обратитесь к врачу.
            script:
                $dialer.reportData("Анамнез", "положительный");
                $dialer.setCallResult("Состояние известно");
            go!: /Прощание

        state: Нет
            intent: /Отказ
            intent: /Здоров
            a: Очень рада, что всё в порядке! Тем не менее, не забывайте мыть руки и носить маски и перчатки.
            script:
                $dialer.reportData("Анамнез", "отрицательный");
                $dialer.setCallResult("Состояние известно");
            go!: /Прощание

        state: Ответ
            event!: noMatch
            a: Так и записала: {{$parseTree.text}}. Помните о гигиене и о средствах индивидуальной защиты.
            script:
                $dialer.reportData("Анамнез", $parseTree.text);
                $dialer.setCallResult("Состояние известно");
            go!: /Прощание

    state: Прощание
        event!: hangup
        a: Будьте здоровы! До свидания!
        script:
            $dialer.hangUp();

    state: Перезвоните
        intent!: /Перезвоните
        a: Хорошо, перезвоню вам позже!
        script:
            $dialer.setCallResult("Просьба перезвонить");
            $dialer.redial({startDateTime: new Date($parseTree._dateTime.timestamp)});
        go!: /Прощание

    state: NoInput || noContext = true
        event!: speechNotRecognized
        script:
            $session.noInputCounter = $session.noInputCounter || 0;
            $session.noInputCounter++;
        if: $session.noInputCounter >= 3
            audio: https://example.com/comms-issue.wav
            script:
                $dialer.setCallResult("Плохое качество связи");
            go!: /Прощание
        else:
            a: Вас плохо слышно. Повторите, пожалуйста!
