// ==========================================
// 1. قاعدة البيانات المحلية للمشافي والأطباء حسب المحافظات
// تمكّن من تحديث القوائم تلقائياً بناءً على اختيار المستخدم
// ==========================================
const medicalData = {
    "حماة": {
        "مشفى حماة الوطني": {
            "قسم العظمية": ["د. سامر الخالد", "د. أسامة العلي"],
            "قسم الأطفال": ["د. منى المصري", "د. طارق الحمصي"],
            "قسم القلبية": ["د. حازم النجار"]
        },
        "مشفى الحكمة الخاص": {
            "قسم العينية": ["د. ريم الشيخ"],
            "قسم الجلدية": ["د. خالد العمر"]
        }
    },
    "حلب": {
        "مشفى حلب الجامعي": {
            "قسم العظمية": ["د. عبد الرحمن الحلبي", "د. يوسف السيد"],
            "قسم الهضمية": ["د. فاطمة الزهراء"]
        },
        "مشفى الشهباء": {
            "قسم الأذن والأنف والحنجرة": ["د. غياث الكردي"]
        }
    },
    "إدلب": {
        "المشفى المحافظة المركزي": {
            "قسم الجراحة العامة": ["د. أحمد الشامي"],
            "قسم الأطفال": ["د. لمى الابراهيم"]
        }
    },
    "حمص": {
        "مشفى حمص الوطني": {
            "قسم القسطرة والقلبية": ["د. وائل السباعي"],
            "قسم العصبية": ["د. هدى السوري"]
        }
    },
    "اللاذقية": {
        "المشفى العسكري": {
            "قسم الداخلية": ["د. علي سليمان"]
        },
        "مشفى الأسد الجامعي": {
            "قسم العيون": ["د. باسم الراعي"]
        }
    },
    "دمشق": {
        "مشفى المواساة": {
            "قسم العظمية": ["د. ماهر الحكيم"],
            "قسم الباطنية": ["د. سحر القاسم"]
        },
        "مشفى الشامي": {
            "قسم القلبية": ["د. نزار العظم"]
        }
    }
};

// ==========================================
// 2. استدعاء عناصر الواجهة من الـ HTML
// ==========================================
const authSection = document.getElementById('authSection');
const authForm = document.getElementById('authForm');
const userInfoHeader = document.getElementById('userInfoHeader');
const headerPatientName = document.getElementById('headerPatientName');

const bookingWizard = document.getElementById('bookingWizard');
const bookingForm = document.getElementById('bookingForm');

const citySelect = document.getElementById('citySelect');
const hospitalSelect = document.getElementById('hospitalSelect');
const departmentSelect = document.getElementById('departmentSelect');
const doctorSelect = document.getElementById('doctorSelect');

const myAppointmentsSection = document.getElementById('myAppointmentsSection');
const activeAppointmentsList = document.getElementById('activeAppointmentsList');

// ==========================================
// 3. إدارة الملف الشخصي للمريض والتسجيل
// يتم حفظ البيانات للتأكد من التعرف على المريض تلقائياً عند عودته
// ==========================================
function checkPatientProfile() {
    const savedPatient = JSON.parse(localStorage.getItem('tabeebPatient'));
    if (savedPatient) {
        // إخفاء نافذة التسجيل وإظهار واجهة الحجز والمواعيد
        authSection.style.display = 'none';
        bookingWizard.style.display = 'block';
        myAppointmentsSection.style.display = 'block';

        // عرض اسم المريض في الهيدر
        userInfoHeader.style.display = 'flex';
        headerPatientName.textContent = `${savedPatient.name} ${savedPatient.lastName}`;

        // تحميل المواعيد المحجوزة سابقاً
        renderAppointments();
    }
}

// حفظ بيانات التسجيل عند الضغط على زر المتابعة
authForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const patientData = {
        name: document.getElementById('patientName').value.trim(),
        lastName: document.getElementById('patientLastName').value.trim(),
        birth: document.getElementById('patientBirth').value,
        phone: document.getElementById('patientPhone').value.trim()
    };

    localStorage.setItem('tabeebPatient', JSON.stringify(patientData));
    checkPatientProfile(); // الانتقال المباشر لشاشة الحجز
});

// ==========================================
// 4. ربط القوائم المنسدلة التفاعلية (المحافظة -> المشفى -> القسم -> الطبيب)
// ==========================================

// عند تغيير المحافظة -> تعبئة المشافي التابعة لها
citySelect.addEventListener('change', function() {
    const selectedCity = this.value;
    hospitalSelect.innerHTML = '<option value="">-- اختر المشفى --</option>';
    departmentSelect.innerHTML = '<option value="">-- اختر المشفى أولاً --</option>';
    doctorSelect.innerHTML = '<option value="">-- اختر القسم أولاً --</option>';

    departmentSelect.disabled = true;
    doctorSelect.disabled = true;

    if (selectedCity && medicalData[selectedCity]) {
        hospitalSelect.disabled = false;
        Object.keys(medicalData[selectedCity]).forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital;
            option.textContent = hospital;
            hospitalSelect.appendChild(option);
        });
    } else {
        hospitalSelect.disabled = true;
    }
});

// عند تغيير المشفى -> تعبئة الأقسام
hospitalSelect.addEventListener('change', function() {
    const selectedCity = citySelect.value;
    const selectedHospital = this.value;

    departmentSelect.innerHTML = '<option value="">-- اختر القسم --</option>';
    doctorSelect.innerHTML = '<option value="">-- اختر القسم أولاً --</option>';
    doctorSelect.disabled = true;

    if (selectedHospital && medicalData[selectedCity][selectedHospital]) {
        departmentSelect.disabled = false;
        Object.keys(medicalData[selectedCity][selectedHospital]).forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentSelect.appendChild(option);
        });
    } else {
        departmentSelect.disabled = true;
    }
});

// عند تغيير القسم -> تعبئة الأطباء المتاحين
departmentSelect.addEventListener('change', function() {
    const selectedCity = citySelect.value;
    const selectedHospital = hospitalSelect.value;
    const selectedDept = this.value;

    doctorSelect.innerHTML = '<option value="">-- اختر الطبيب --</option>';

    if (selectedDept && medicalData[selectedCity][selectedHospital][selectedDept]) {
        doctorSelect.disabled = false;
        medicalData[selectedCity][selectedHospital][selectedDept].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        });
    } else {
        doctorSelect.disabled = true;
    }
});

// ==========================================
// 5. قطع التذكرة وحفظ الموعد
// ==========================================
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const appointment = {
        id: Date.now(),
        city: citySelect.value,
        hospital: hospitalSelect.value,
        department: departmentSelect.value,
        doctor: doctorSelect.value,
        time: document.getElementById('appointmentTime').value,
        status: "مؤكد"
    };

    let appointments = JSON.parse(localStorage.getItem('tabeebAppointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('tabeebAppointments', JSON.stringify(appointments));

    alert("تم تأكيد قطع التذكرة بنجاح!");
    bookingForm.reset();

    // إعادة تعطيل القوائم التابعة بعد إعادة تعيين النموذج
    hospitalSelect.disabled = true;
    departmentSelect.disabled = true;
    doctorSelect.disabled = true;

    renderAppointments(); // تحديث قائمة المواعيد
});

// ==========================================
// 6. عرض التذاكر والمواعيد المحجوزة
// ==========================================
function renderAppointments() {
    const appointments = JSON.parse(localStorage.getItem('tabeebAppointments')) || [];
    activeAppointmentsList.innerHTML = "";

    if (appointments.length === 0) {
        activeAppointmentsList.innerHTML = '<p style="text-align:center; color:#64748b;">لا توجد مواعيد محجوزة حالياً.</p>';
        return;
    }

    appointments.forEach(app => {
        const ticket = document.createElement('div');
        ticket.className = 'ticket-card';
        ticket.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-title"><i class="fa-solid fa-hospital"></i> ${app.hospital} (${app.city})</span>
                <span class="ticket-status">${app.status}</span>
            </div>
            <div class="ticket-details">
                <p><strong>القسم:</strong> ${app.department}</p>
                <p><strong>الطبيب:</strong> ${app.doctor}</p>
                <p><strong>الموعد:</strong> ${app.time.replace('T', ' - ')}</p>
            </div>
        `;
        activeAppointmentsList.appendChild(ticket);
    });
}

// تشغيل التحقق المباشر فور فتح الصفحة
checkPatientProfile();


// ==========================================
// 7. برمجة زر تسجيل الخروج لتبديل المريض
// ==========================================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm("هل تريد تسجيل الخروج والتبديل إلى مريض آخر؟")) {
            // حذف بيانات المريض الحالي من الذاكرة
            localStorage.removeItem('tabeebPatient');
            
            // إخفاء واجهات الحجز والمواعيد وإعادة إظهار نموذج التسجيل
            authSection.style.display = 'block';
            bookingWizard.style.display = 'none';
            myAppointmentsSection.style.display = 'none';
            userInfoHeader.style.display = 'none';

            // تفريغ نموذج إدخال المريض
            authForm.reset();
        }
    });
}