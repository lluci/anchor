const HABIT_CONFIG = {
    dormir: {
        label: "Dormir",
        start: "07:00",
        greenEnd: "08:00",
        orangeEnd: "08:30",
        redEnd: "09:00",
        icon: "😴",
        isEssential: true
    },
    mati: {
        label: "Mig Matí",
        start: "10:30",
        greenEnd: "11:30",
        orangeEnd: "12:00",
        redEnd: "12:30",
        icon: "☕️",
        isEssential: false
    },
    dinar: {
        label: "Dinar",
        start: "13:00",
        greenEnd: "14:00",
        orangeEnd: "15:00",
        redEnd: "16:00",
        icon: "🍽",
        isEssential: true
    },
    berenar: {
        label: "Berenar",
        start: "17:00",
        greenEnd: "17:30",
        orangeEnd: "18:00",
        redEnd: "18:30",
        icon: "🍎",
        isEssential: false
    },
    sopar: {
        label: "Sopar",
        start: "19:00",
        greenEnd: "20:00",
        orangeEnd: "21:00",
        redEnd: "22:00",
        icon: "🍲",
        isEssential: true
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
    omit: "Ometre avui",
    accept: "Desar",
    cancel: "Cancel·lar",
    edited: "Editat",
    confirmSkip: "Confirmar",
    selectReason: "Selecciona motiu...",
    settingsData: "Configuració i Estadístiques",
    skipToday: "Marcar dia com a No Disponible",
    restoreToday: "Restaurar",
    normalDay: "Dia Normal",
    specialDay: "Dia Especial",
    essentialOnly: "Indispensables",
    allTasks: "Totes (Especial)",
    reset: "Restablir",
    finishDay: "Finalitzar el dia"
};

const SKIP_REASONS = {
    work_block: "Feina / Obligacions",
    health_block: "Salut / Energia",
    external_block: "Circumstàncies externes",
    not_today: "Avui no"
};

const TEST_MODE_CONFIG = {
    enabled: true, // Set to true to start in Test Mode
    isVisible: true, // Set to false to hide the panel entirely
    initialTime: "15:45" // "13:45", "14:45", or "15:45"
};