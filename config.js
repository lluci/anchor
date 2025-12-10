const HABIT_CONFIG = {
    dormir: {
        label: "Llevar-se",      // Wake up time
        start: "07:30",
        prep: 15,                 // Notification 15 min before (06:45)
        greenDuration: 30,        // Green window: 07:00 - 08:00 (1 hour)
        margins: 15,              // Orange: 08:00-08:30, Red: 08:30-09:00 (30 min each)
        executionTime: 15,        // Time needed to complete (30 min)
        icon: "😃",
        isEssential: true
    },
    activacioMatinal: {
        label: "Activació",
        start: "9:00",
        prep: 15,                 // Notification at 08:45
        greenDuration: 45,        // Green window: 09:00 - 10:00 (1 hour)
        margins: 30,              // Orange: 10:00-10:30, Red: 10:30-11:00 (30 min each)
        executionTime: 30,        // Time needed to complete (30 min)
        icon: "🔥",
        isEssential: false
    },
    dinar: {
        label: "Dinar",
        start: "13:00",
        prep: 15,                 // Notification at 12:45
        greenDuration: 60,        // Green window: 13:00 - 14:30 (1.5 hours)
        margins: 30,              // Orange: 14:30-15:00, Red: 15:00-15:30 (30 min each)
        executionTime: 45,        // Time needed to complete (45 min)
        icon: "🍽",
        isEssential: true
    },
    sopar: {
        label: "Sopar",
        start: "20:00",
        prep: 15,                 // Notification at 19:45
        greenDuration: 60,        // Green window: 20:00 - 21:30 (1.5 hours)
        margins: 30,              // Orange: 21:30-22:00, Red: 22:00-22:30 (30 min each)
        executionTime: 45,        // Time needed to complete (45 min)
        icon: "🍲",
        isEssential: true
    },
    baixarRitme: {
        label: "Baixar el ritme", // Slow down and prepare to sleep
        start: "22:30",
        prep: 15,                 // Notification at 21:45
        greenDuration: 30,        // Green window: 22:00 - 22:30 (30 min)
        margins: 15,              // Orange: 22:30-23:00, Red: 23:00-23:30 (30 min each)
        executionTime: 20,        // Time needed to complete (20 min)
        icon: "😴",
        isEssential: false
    }
};

// CONFIGURATION
const API_URL = "https://script.google.com/macros/s/AKfycbynU-Vm_-ubA9hVBZQoN_JUAQlsax8NX_bweI6fOxv8mSnmV8uPLK8JZm41fR5zXwHN/exec";

const WINDOW_VARIANTS = {
    green: { label: "A temps", statusText: "A temps", badgeClass: "badge-green" },
    orange: { label: "Tard", statusText: "Tard", badgeClass: "badge-orange" },
    red: { label: "Urgent", statusText: "Urgent", badgeClass: "badge-red" },
};

const BUTTON_LABELS = {
    accept: "Guardar",
    cancel: "Cancel·lar",
    done: "Fet",
    edited: "Editat",
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
    defaultTimeOverride: false, // Enable Time Override by default?
    defaultDayOverride: false,  // Enable Day Mode Override by default?
    initialTime: "15:15"   // Default time selection. Options: "13:45", "14:45", or "15:45"
};