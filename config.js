const HABIT_CONFIG = {
    dormir: {
        label: "Dormir",
        start: "07:00",
        greenEnd: "08:00",
        orangeEnd: "09:00",
        redEnd: "10:00",
        icon: "😴",
    },
    dinar: {
        label: "Dinar",
        start: "13:00",
        greenEnd: "14:30",
        orangeEnd: "15:00",
        redEnd: "16:00",
        icon: "🍽",
    },
    sopar: {
        label: "Sopar",
        start: "19:00",
        greenEnd: "20:00",
        orangeEnd: "21:00",
        redEnd: "22:00",
        icon: "🍲",
    },
};

const WINDOW_VARIANTS = {
    green: { label: "Franja verda", statusText: "Franja verda", badgeClass: "badge-green" },
    orange: { label: "Franja taronja", statusText: "Franja taronja", badgeClass: "badge-orange" },
    red: { label: "Franja vermella", statusText: "Franja vermella", badgeClass: "badge-red" },
};

const BUTTON_LABELS = {
    done: "Fet",
    edit: "Editar franja",
    omit: "Ometre avui"
};