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
        label: "Activació",
        start: "9:00",
        greenEnd: "10:00",
        orangeEnd: "10:30",
        redEnd: "11:00",
        icon: "🔥",
        isEssential: false
    },
    dinar: {
        label: "Dinar",
        start: "13:00",
        greenEnd: "14:30",
        orangeEnd: "15:00",
        redEnd: "15:30",
        icon: "🍽",
        isEssential: true
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
    berenar: {
        label: "Baixar el ritme",// Slow down and prepare to sleep
        start: "22:00",
        greenEnd: "22:30",
        orangeEnd: "23:00",
        redEnd: "23:30",
        icon: "😴",
        isEssential: false
    }
};

// CONFIGURATION
const API_URL = "https://script.google.com/macros/s/AKfycbynU-Vm_-ubA9hVBZQoN_JUAQlsax8NX_bweI6fOxv8mSnmV8uPLK8JZm41fR5zXwHN/exec";

const WINDOW_VARIANTS = {
    green: { label: "Franja verda", statusText: "Franja verda", badgeClass: "badge-green" },
    orange: { label: "Franja taronja", statusText: "Franja taronja", badgeClass: "badge-orange" },
    red: { label: "Franja vermella", statusText: "Franja vermella", badgeClass: "badge-red" },
};

const BUTTON_LABELS = {
    accept: "Guardar",
    cancel: "Cancel·lar",
    done: "Fet",
    edit: "Editar",
    omit: "Ometre",
    reset: "Restablir",
    finishDay: "Finalitzar el dia",
    essentialOnly: "Mode Essencial",
    allTasks: "Mode Flexible",
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
    isVisible: true,      // Show the panel?
    defaultTimeOverride: true, // Enable Time Override by default?
    defaultDayOverride: true,  // Enable Day Mode Override by default?
    initialTime: "15:15"   // Default time selection. Options: "13:45", "14:45", or "15:45"
};