// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: You can unobserve if you want it to trigger only once
            // observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Trigger intro reveal for items already in viewport on load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions').forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});

// Auto-calculate age based on DOB
const dobInput = document.getElementById('dob');
const ageInput = document.getElementById('age');

dobInput.addEventListener('change', () => {
    if (dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        ageInput.value = age;
    }
});

// Handle Form Submission
const form = document.getElementById('consultation-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.querySelector('.submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset message
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';

    // Get chosen services
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    const services = Array.from(serviceCheckboxes).map(cb => cb.value);

    if (services.length === 0) {
        showMessage('Please select at least one service.', 'error');
        return;
    }

    // Collect data
    const payload = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        age: document.getElementById('age').value,
        services: services
    };

    try {
        // Change button state
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Send to backend
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showMessage(data.message, 'success');

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const serviceStr = services.join(', ');

            const message = 
              `Hello! I have recently registered for a free consultation on your website.\n\n` +
              `*Name:* ${name}\n` +
              `*Phone:* ${phone}\n` +
              `*Email:* ${email}\n` +
              `*Service Required:* ${serviceStr}\n\n` +
              `Please let me know the next steps. Thank you!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = '919923087892';

            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

            form.reset(); // Clear form
        } else {
            showMessage(data.message || 'Something went wrong.', 'error');
        }
    } catch (error) {
        showMessage('Unable to connect to the server. Please try again later.', 'error');
    } finally {
        submitBtn.textContent = 'Request Consultation';
        submitBtn.disabled = false;
    }
});

function showMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---- New Services Tab Logic ----
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Logic to tie Suboptions to Contact Form
const subcards = document.querySelectorAll('.service-subcard');
const selectedSuboptionsWrapper = document.getElementById('selected-suboptions-wrapper');
const selectedSuboptionsList = document.getElementById('selected-suboptions-list');
let selectedServices = new Set();

subcards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceName = card.getAttribute('data-service');
        
        if (selectedServices.has(serviceName)) {
            selectedServices.delete(serviceName);
            card.style.borderColor = 'var(--border-color)';
            card.style.background = 'var(--surface-color)'; // default glass
        } else {
            selectedServices.add(serviceName);
            card.style.borderColor = 'var(--success)';
            card.style.background = 'rgba(46, 160, 67, 0.1)';
        }

        updateSelectedServicesDisplay();
    });
});

function updateSelectedServicesDisplay() {
    if (selectedServices.size > 0) {
        selectedSuboptionsWrapper.style.display = 'block';
        selectedSuboptionsList.innerHTML = Array.from(selectedServices).join('<br> • ');
    } else {
        selectedSuboptionsWrapper.style.display = 'none';
        selectedSuboptionsList.innerHTML = '';
    }
}

// "Other" Planning Submission Routing
const btnSubmitOther = document.getElementById('btn-submit-other');
const customServiceInput = document.getElementById('custom-service-input');
const contactOtherText = document.getElementById('contact-other-text');
const otherCheckboxMain = document.getElementById('other-checkbox-main');

if (btnSubmitOther) {
    btnSubmitOther.addEventListener('click', () => {
        const customText = customServiceInput.value.trim();
        if (customText) {
            // Check 'Other' checkbox in contact form
            otherCheckboxMain.checked = true;
            // Place text in the secondary input and show it
            contactOtherText.value = customText;
            contactOtherText.style.display = 'block';
            
            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            
            // Optional: Auto focus Name field
            setTimeout(() => document.getElementById('name').focus(), 800);
        } else {
            customServiceInput.focus();
        }
    });
}

// Ensure the contact 'Other' checkbox toggles the text input visibility manually too
if (otherCheckboxMain) {
    otherCheckboxMain.addEventListener('change', (e) => {
        if(e.target.checked) {
            contactOtherText.style.display = 'block';
        } else {
            contactOtherText.style.display = 'none';
        }
    });
}

// ---- INTERACTIVE TOOLS LOGIC ----

// Generic tool tabs logic (Calculators / Risk / Goal Planner)
const toolTabBtns = document.querySelectorAll('.tool-tabs .tab-btn');
const toolTabContents = document.querySelectorAll('#tools .tab-content');

toolTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toolTabBtns.forEach(b => b.classList.remove('active'));
        toolTabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Calculator sidebar tabs
const calcBtns = document.querySelectorAll('.calc-btn');
const calcViews = document.querySelectorAll('.calc-view');

calcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        calcBtns.forEach(b => b.classList.remove('active'));
        calcViews.forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
        });
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-calc');
        const targetView = document.getElementById(targetId);
        targetView.style.display = 'block';
        setTimeout(() => targetView.classList.add('active'), 50);
    });
});

// Common format helper
const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

// 1. SIP Calculator: FV = P × ({[1 + i]^n - 1} / i) × (1 + i)
window.calculateSIP = () => {
    const P = parseFloat(document.getElementById('sip-amount').value);
    const rate = parseFloat(document.getElementById('sip-rate').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    
    if(!P || !rate || !years) return;
    
    const i = (rate / 100) / 12;
    const n = years * 12;
    const invested = P * n;
    const fv = P * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
    const returns = fv - invested;

    const res = document.getElementById('sip-result');
    res.style.display = 'block';
    res.innerHTML = `
        <h4>Expected Amount: ${formatCurrency(fv)}</h4>
        <p>Total Invested: ${formatCurrency(invested)}</p>
        <p>Wealth Gained: ${formatCurrency(returns)}</p>
    `;
};

// 2. EMI Calculator: E = P.r.(1+r)^n/((1+r)^n - 1)
window.calculateEMI = () => {
    const P = parseFloat(document.getElementById('emi-amount').value);
    const rate = parseFloat(document.getElementById('emi-rate').value);
    const years = parseFloat(document.getElementById('emi-years').value);
    
    if(!P || !rate || !years) return;

    const r = (rate / 100) / 12;
    const n = years * 12;
    const emi = P * r * (Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const totalAmount = emi * n;

    const res = document.getElementById('emi-result');
    res.style.display = 'block';
    res.innerHTML = `
        <h4>Monthly EMI: ${formatCurrency(emi)}</h4>
        <p>Total Interest Payable: ${formatCurrency(totalAmount - P)}</p>
        <p>Total Payment: ${formatCurrency(totalAmount)}</p>
    `;
};

// 3. Retirement Calculator
window.calculateRetirement = () => {
    const currentAge = parseFloat(document.getElementById('ret-age').value);
    const retAge = parseFloat(document.getElementById('ret-retage').value);
    const exp = parseFloat(document.getElementById('ret-exp').value);
    const inf = parseFloat(document.getElementById('ret-inf').value);

    if(!currentAge || !retAge || !exp || !inf || retAge <= currentAge) return;

    const yrsToRetire = retAge - currentAge;
    const futureMonthlyExp = exp * Math.pow(1 + (inf/100), yrsToRetire);
    // Rough estimate rule: Need 25x annual future expenses for corpus if withdrawing 4%
    const corpus = futureMonthlyExp * 12 * 25;

    const res = document.getElementById('ret-result');
    res.style.display = 'block';
    res.innerHTML = `
        <h4>Required Corpus: ${formatCurrency(corpus)}</h4>
        <p>Monthly Expenses at Age ${retAge}: ${formatCurrency(futureMonthlyExp)}</p>
        <p style="font-size:0.9rem" class="text-muted">Assumption: 4% safe withdrawal rate post-retirement.</p>
    `;
};

// 4. Tax Savings
window.calculateTax = () => {
    const income = parseFloat(document.getElementById('tax-income').value);
    const inv80cRaw = parseFloat(document.getElementById('tax-80c').value);

    if(!income) return;

    const inv80c = Math.min(inv80cRaw, 150000);
    // Typical tax slabs (simplified for old regime > 5L)
    let calcTaxSaving = 0;
    if(income > 1000000) calcTaxSaving = inv80c * 0.30;
    else if(income > 500000) calcTaxSaving = inv80c * 0.20;
    else calcTaxSaving = inv80c * 0.05;

    const cess = calcTaxSaving * 0.04;
    const totalSaving = calcTaxSaving + cess;

    const res = document.getElementById('tax-result');
    res.style.display = 'block';
    res.innerHTML = `
        <h4>Total Tax Saved: ${formatCurrency(totalSaving)}</h4>
        <p>Includes 4% Health & Education Cess</p>
    `;
};

// ---- RISK PROFILE QUIZ ----
const quizQuestions = [
    {
        q: "1. What is your primary goal for investing?",
        opts: [
            { t: "A) Protect my main capital, even if returns are low.", s: 1 },
            { t: "B) Beat inflation with steady, moderate growth.", s: 2 },
            { t: "C) Maximize wealth over long term regardless of volatility.", s: 3 }
        ]
    },
    {
        q: "2. If your investment portfolio dropped by 20% in a month, what would you do?",
        opts: [
            { t: "A) Sell immediately to prevent further loss.", s: 1 },
            { t: "B) Wait it out; markets eventually recover.", s: 2 },
            { t: "C) Buy more to take advantage of low prices.", s: 3 }
        ]
    },
    {
        q: "3. When do you need to withdraw a significant portion of these funds?",
        opts: [
            { t: "A) Within 1-3 years.", s: 1 },
            { t: "B) In 4-7 years.", s: 2 },
            { t: "C) Not for 8+ years.", s: 3 }
        ]
    },
    {
        q: "4. Which of these portfolios sounds best to you?",
        opts: [
            { t: "A) 100% Fixed Deposits / Debt Funds. Safe and known.", s: 1 },
            { t: "B) 50% Equity / 50% Debt. Balanced risk and reward.", s: 2 },
            { t: "C) 100% Equity. High risk, highest potential returns.", s: 3 }
        ]
    },
    {
        q: "5. How experienced are you with investing?",
        opts: [
            { t: "A) Beginner. I just use bank deposits currently.", s: 1 },
            { t: "B) Intermediate. I have some mutual funds/SIPs.", s: 2 },
            { t: "C) Advanced. I understand market cycles.", s: 3 }
        ]
    }
];

let currentQ = 0;
let score = 0;

function renderQuiz() {
    const qEl = document.getElementById('quiz-q');
    const optsEl = document.getElementById('quiz-opts');
    const resEl = document.getElementById('quiz-result');
    const containerEl = document.getElementById('quiz-container');

    if(currentQ >= quizQuestions.length) {
        containerEl.style.display = 'none';
        resEl.style.display = 'block';
        let profile = "";
        let details = "";
        if (score <= 7) {
            profile = "Conservative Investor";
            details = "You prefer safety over high returns. Capital preservation is your priority. We recommend focusing on LIC Endowment/Money-Back policies, FDs, and Debt Mutual Funds.";
        } else if (score <= 11) {
            profile = "Moderate Investor";
            details = "You seek a balance between risk and reward. You want to beat inflation but avoid extreme drops. We recommend Hybrid Mutual Funds, conservative SIPs, and Term Life Insurance combinations.";
        } else {
            profile = "Aggressive Investor";
            details = "You are comfortable with market volatility in pursuit of high wealth creation. We recommend purely Equity-based Mutual Funds, Small/Mid Cap SIPs, and standard Term Life cover.";
        }
        resEl.innerHTML = `
            <div style="background: rgba(10, 25, 47, 0.4); border: 2px solid var(--accent); padding: 30px; border-radius: 12px; display: inline-block; text-align: left; max-width: 600px;">
                <h3 style="color: var(--accent); margin-bottom: 5px;">Your Profile: ${profile}</h3>
                <p style="margin-bottom: 20px;">Score: ${score} / 15</p>
                <p style="font-size: 1.1rem; line-height: 1.6;">${details}</p>
                <button class="btn btn-primary" style="margin-top:20px;" onclick="location.hash='#contact'">Speak to an Advisor</button>
                <button class="btn btn-secondary" style="margin-top:20px; margin-left:10px;" onclick="resetQuiz()">Retake Quiz</button>
            </div>
        `;
        return;
    }

    const qData = quizQuestions[currentQ];
    qEl.textContent = qData.q;
    optsEl.innerHTML = '';
    
    qData.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opts-btn';
        btn.textContent = opt.t;
        btn.onclick = () => {
            score += opt.s;
            currentQ++;
            renderQuiz();
        };
        optsEl.appendChild(btn);
    });
}

window.resetQuiz = () => {
    currentQ = 0;
    score = 0;
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    renderQuiz();
};

if(document.getElementById('quiz-q')) {
    renderQuiz();
}

// ---- GOAL PLANNER ----
window.calculateGoal = () => {
    const target = parseFloat(document.getElementById('goal-amount').value);
    const years = parseFloat(document.getElementById('goal-years').value);
    const rate = parseFloat(document.getElementById('goal-rate').value);

    if(!target || !years || !rate) return;

    const n = years * 12;
    const i = (rate / 100) / 12;
    
    // Reverse SIP Formula: P = FV / [ ( (1 + i)^n - 1 ) / i * (1 + i) ]
    const sipReq = target / ( ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i) );

    const res = document.getElementById('goal-result');
    res.style.display = 'block';
    res.innerHTML = `
        <h4>Required Monthly SIP: ${formatCurrency(sipReq)}</h4>
        <p>Start a SIP of this amount to reach ${formatCurrency(target)} in ${years} years.</p>
    `;
};
