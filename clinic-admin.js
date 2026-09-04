// استدعاء عناصر الواجهة
const adminAppointmentsTable = document.getElementById('adminAppointmentsTable');
const totalCount = document.getElementById('totalCount');
const confirmedCount = document.getElementById('confirmedCount');
const cancelledCount = document.getElementById('cancelledCount');

// ==========================================
// 1. جلب المواعيد من الذاكرة وحساب الإحصائيات
// ==========================================
function loadAdminDashboard() {
    const appointments = JSON.parse(localStorage.getItem('tabeebAppointments')) || [];

    // تحديث الإحصائيات السريعة
    totalCount.textContent = appointments.length;
    confirmedCount.textContent = appointments.filter(a => a.status === "مؤكد").length;
    cancelledCount.textContent = appointments.filter(a => a.status === "ملغى").length;

    // تفريغ الجدول
    adminAppointmentsTable.innerHTML = "";

    if (appointments.length === 0) {
        adminAppointmentsTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
                    لا توجد حجوزات واردة حتى الآن.
                </td>
            </tr>
        `;
        return;
    }

    // تعبئة الجدول بالمواعيد
    appointments.forEach(app => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #e2e8f0";

        // تحديد لون شارة الحالة
        let statusStyle = "background: #dcfce7; color: #16a34a;"; // أخضر للمؤكد
        if (app.status === "ملغى") {
            statusStyle = "background: #fee2e2; color: #dc2626;"; // أحمر للملغى
        }

        row.innerHTML = `
            <td style="padding: 12px; font-weight: bold;">
                ${app.hospital}<br>
                <small style="color: #64748b; font-weight: normal;"><i class="fa-solid fa-location-dot"></i> ${app.city}</small>
            </td>
            <td style="padding: 12px;">
                ${app.department}<br>
                <small style="color: #0083b0;">${app.doctor}</small>
            </td>
            <td style="padding: 12px; direction: ltr; text-align: right;">
                ${app.time.replace('T', ' ')}
            </td>
            <td style="padding: 12px;">
                <span style="padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; ${statusStyle}">
                    ${app.status}
                </span>
            </td>
            <td style="padding: 12px;">
                <button onclick="updateStatus(${app.id}, 'مؤكد')" style="background: #10b981; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-left: 5px;" title="تأكيد الموعد">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button onclick="updateStatus(${app.id}, 'ملغى')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;" title="إلغاء الموعد">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </td>
        `;

        adminAppointmentsTable.appendChild(row);
    });
}

// ==========================================
// 2. دالة تغيير حالة الموعد (تأكيد / إلغاء)
// ==========================================
function updateStatus(id, newStatus) {
    let appointments = JSON.parse(localStorage.getItem('tabeebAppointments')) || [];

    // البحث عن الموعد بواسطة المعرّف وتحديث حالته
    appointments = appointments.map(app => {
        if (app.id === id) {
            app.status = newStatus;
        }
        return app;
    });

    // إعادة الحفظ في الذاكرة
    localStorage.setItem('tabeebAppointments', JSON.stringify(appointments));

    // تحديث الواجهة فوراً
    loadAdminDashboard();
}

// تشغيل اللوحة فور فتح الصفحة
loadAdminDashboard();