document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const csvFileInput = document.getElementById('csvFileInput');
    const validEmailsBody = document.getElementById('validEmailsBody');
    const invalidEmailsBody = document.getElementById('invalidEmailsBody');
    const validCount = document.getElementById('validCount');
    const invalidCount = document.getElementById('invalidCount');
    const undoUpload = document.getElementById('undoUpload');
    const composeSection = document.getElementById('composeSection');
    const composeContent = document.getElementById('composeContent');
    const toggleCompose = document.getElementById('toggleCompose');
    const sendEmailsBtn = document.getElementById('sendEmails');
    const emailSubject = document.getElementById('emailSubject');
    const emailMessage = document.getElementById('emailMessage');
    const validFilter = document.getElementById('validFilter');
    const invalidFilter = document.getElementById('invalidFilter');
    const validPrev = document.getElementById('validPrev');
    const validNext = document.getElementById('validNext');
    const invalidPrev = document.getElementById('invalidPrev');
    const invalidNext = document.getElementById('invalidNext');
    const validPageInfo = document.getElementById('validPageInfo');
    const invalidPageInfo = document.getElementById('invalidPageInfo');
    const sendModal = new bootstrap.Modal(document.getElementById('sendModal'));
    const sendProgress = document.getElementById('sendProgress');
    const sendStatus = document.getElementById('sendStatus');
    const downloadInvalidBtn = document.getElementById('downloadInvalid');
    const sendHistory = document.getElementById('sendHistory');
    const toastMessage = new bootstrap.Toast(document.getElementById('toastMessage'));

    let validEmails = [];
    let invalidEmails = [];
    let filteredValidEmails = [];
    let filteredInvalidEmails = [];
    let sendHistoryData = JSON.parse(localStorage.getItem('sendHistory')) || [];
    let validPage = 1;
    let invalidPage = 1;
    const pageSize = 50;

    // Email validation regex and reasons
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validateEmail = (email) => {
        if (!email) return { valid: false, reason: 'Empty email' };
        if (!email.includes('@')) return { valid: false, reason: 'Missing @ symbol' };
        if (!email.includes('.')) return { valid: false, reason: 'Missing domain' };
        if (!emailRegex.test(email)) return { valid: false, reason: 'Invalid format' };
        return { valid: true, reason: '' };
    };

    // Animate cards on load
    gsap.from('.animate-card', {
        duration: 0.8,
        scale: 0.95,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        onComplete: () => {
            document.querySelectorAll('.animate-card').forEach(card => {
                card.style.opacity = 1;
                card.style.transform = 'scale(1)';
            });
        }
    });

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
        gsap.to(dropZone, { scale: 1.02, duration: 0.3 });
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
        gsap.to(dropZone, { scale: 1, duration: 0.3 });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        gsap.to(dropZone, { scale: 1, duration: 0.3 });
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            processFile(file);
        } else {
            showToast('Please upload a valid CSV file.');
        }
    });

    // File input click
    dropZone.addEventListener('click', () => csvFileInput.click());

    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            processFile(file);
        } else {
            showToast('Please upload a valid CSV file.');
        }
    });

    // Toggle compose section
    toggleCompose.addEventListener('click', () => {
        const isCollapsed = composeContent.style.display === 'none';
        composeContent.style.display = isCollapsed ? 'block' : 'none';
        toggleCompose.textContent = isCollapsed ? 'Collapse' : 'Expand';
        gsap.from(composeContent, {
            height: isCollapsed ? 0 : 'auto',
            opacity: isCollapsed ? 0 : 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // Toggle table collapse
    document.querySelectorAll('.toggle-table').forEach(button => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.dataset.bsTarget);
            const collapse = bootstrap.Collapse.getOrCreateInstance(target);
            collapse.toggle();
        });
    });

    // Process CSV file
    function processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n').map(row => row.trim()).filter(row => row);
            validEmails = [];
            invalidEmails = [];
            validPage = 1;
            invalidPage = 1;

            rows.forEach((row) => {
                const email = row.split(',')[0].trim();
                const { valid, reason } = validateEmail(email);
                if (valid) {
                    validEmails.push(email);
                } else if (email) {
                    invalidEmails.push({ email, reason });
                }
            });

            filteredValidEmails = [...validEmails];
            filteredInvalidEmails = [...invalidEmails];
            updateEmailLists();
            animateEmailCounts(validEmails.length, invalidEmails.length);
            composeSection.style.display = validEmails.length > 0 ? 'block' : 'none';
            undoUpload.classList.toggle('d-none', false);
            downloadInvalidBtn.classList.toggle('d-none', invalidEmails.length === 0);
            showToast(`Processed ${rows.length} rows. Found ${validEmails.length} valid and ${invalidEmails.length} invalid emails.`);
        };
        reader.onerror = () => showToast('Error reading file.');
        reader.readAsText(file);
    }

    // Update email lists with pagination
    function updateEmailLists() {
        const validStart = (validPage - 1) * pageSize;
        const validEnd = validStart + pageSize;
        const validSlice = filteredValidEmails.slice(validStart, validEnd);
        validEmailsBody.innerHTML = validSlice.map(email => `<tr><td>${email}</td></tr>`).join('');
        validPageInfo.textContent = `Page ${validPage} of ${Math.ceil(filteredValidEmails.length / pageSize) || 1}`;
        validPrev.disabled = validPage === 1;
        validNext.disabled = validEnd >= filteredValidEmails.length;

        const invalidStart = (invalidPage - 1) * pageSize;
        const invalidEnd = invalidStart + pageSize;
        const invalidSlice = filteredInvalidEmails.slice(invalidStart, invalidEnd);
        invalidEmailsBody.innerHTML = invalidSlice.map(({ email, reason }) => `<tr><td>${email}</td><td>${reason}</td></tr>`).join('');
        invalidPageInfo.textContent = `Page ${invalidPage} of ${Math.ceil(filteredInvalidEmails.length / pageSize) || 1}`;
        invalidPrev.disabled = invalidPage === 1;
        invalidNext.disabled = invalidEnd >= filteredInvalidEmails.length;

        gsap.from('.table tbody tr', {
            duration: 0.5,
            x: -10,
            opacity: 0,
            stagger: 0.05,
            ease: 'power2.out',
            onComplete: () => {
                document.querySelectorAll('.table tbody tr').forEach(row => {
                    row.style.opacity = 1;
                    row.style.transform = 'translateX(0)';
                });
            }
        });
    }

    // Animate email counts
    function animateEmailCounts(valid, invalid) {
        gsap.to(validCount, {
            duration: 0.5,
            textContent: `Valid Emails: ${valid}`,
            roundProps: 'textContent',
            ease: 'power1.out'
        });
        gsap.to(invalidCount, {
            duration: 0.5,
            textContent: `Invalid Emails: ${invalid}`,
            roundProps: 'textContent',
            ease: 'power1.out'
        });
    }

    // Show toast message with animation
    function showToast(message) {
        document.querySelector('.toast-body').textContent = message;
        toastMessage.show();
        gsap.fromTo('.toast', {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    // Email filtering
    validFilter.addEventListener('input', (e) => {
        validPage = 1;
        const query = e.target.value.toLowerCase();
        filteredValidEmails = validEmails.filter(email => email.toLowerCase().includes(query));
        updateEmailLists();
    });

    invalidFilter.addEventListener('input', (e) => {
        invalidPage = 1;
        const query = e.target.value.toLowerCase();
        filteredInvalidEmails = invalidEmails.filter(({ email }) => email.toLowerCase().includes(query));
        updateEmailLists();
    });

    // Pagination controls
    validPrev.addEventListener('click', () => {
        if (validPage > 1) {
            validPage--;
            updateEmailLists();
        }
    });

    validNext.addEventListener('click', () => {
        if (validPage < Math.ceil(filteredValidEmails.length / pageSize)) {
            validPage++;
            updateEmailLists();
        }
    });

    invalidPrev.addEventListener('click', () => {
        if (invalidPage > 1) {
            invalidPage--;
            updateEmailLists();
        }
    });

    invalidNext.addEventListener('click', () => {
        if (invalidPage < Math.ceil(filteredInvalidEmails.length / pageSize)) {
            invalidPage++;
            updateEmailLists();
        }
    });

    // Undo upload
    undoUpload.addEventListener('click', () => {
        validEmails = [];
        invalidEmails = [];
        filteredValidEmails = [];
        filteredInvalidEmails = [];
        validPage = 1;
        invalidPage = 1;
        updateEmailLists();
        animateEmailCounts(0, 0);
        composeSection.style.display = 'none';
        composeContent.style.display = 'block';
        toggleCompose.textContent = 'Collapse';
        undoUpload.classList.add('d-none');
        downloadInvalidBtn.classList.add('d-none');
        csvFileInput.value = '';
        showToast('Upload cleared.');
    });

    // Simulate sending emails with increased speed
    sendEmailsBtn.addEventListener('click', () => {
        if (!emailSubject.value || !emailMessage.value) {
            showToast('Please enter both subject and message.');
            return;
        }

        sendModal.show();
        sendProgress.style.width = '0%';
        sendStatus.textContent = 'Preparing to send...';

        let progress = 0;
        const batchSize = 10; // Process 10 emails per step
        const delay = 50; // 50ms per batch
        const totalSteps = Math.ceil(validEmails.length / batchSize);

        const interval = setInterval(() => {
            progress += (100 / totalSteps);
            const currentEmailCount = Math.min(Math.floor(progress / (100 / validEmails.length)), validEmails.length);
            gsap.to(sendProgress, { width: `${Math.min(progress, 100)}%`, duration: 0.3, ease: 'power2.inOut' });
            sendStatus.textContent = `Sending email ${currentEmailCount} of ${validEmails.length}...`;

            if (progress >= 100) {
                clearInterval(interval);
                sendStatus.textContent = `${validEmails.length} Emails Sent Successfully!`;
                const historyItem = {
                    timestamp: new Date().toLocaleString(),
                    subject: emailSubject.value,
                    message: emailMessage.value,
                    count: validEmails.length
                };
                sendHistoryData.push(historyItem);
                localStorage.setItem('sendHistory', JSON.stringify(sendHistoryData));
                updateSendHistory();
                setTimeout(() => sendModal.hide(), 1000);
            }
        }, delay);
    });

    // Update send history
    function updateSendHistory() {
        sendHistory.innerHTML = sendHistoryData.map(item => `
            <li class="list-group-item">
                <strong>${item.timestamp}</strong>: Sent ${item.count} emails with subject "${item.subject}"
            </li>
        `).join('');
        gsap.from('.list-group-item', {
            duration: 0.5,
            opacity: 0,
            y: 10,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // Download invalid emails as CSV
    downloadInvalidBtn.addEventListener('click', () => {
        const csvContent = 'data:text/csv;charset=utf-8,Email,Reason\n' + 
            invalidEmails.map(({ email, reason }) => `"${email}","${reason}"`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'invalid_emails.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initialize history
    updateSendHistory();

    // Ensure initial visibility
    document.querySelectorAll('.card, .compose-panel, .drop-zone, .table, #composeSection').forEach(el => {
        el.style.display = '';
        el.style.opacity = 1;
    });
});