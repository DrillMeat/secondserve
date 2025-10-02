// PharmaT Audit Dashboard JavaScript

// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadAuditData();
    setupEventListeners();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('PharmaT Audit Dashboard initialized');
    
    // Check if user is logged in (basic check)
    const userSession = sessionStorage.getItem('pharmat_user');
    if (!userSession) {
        // Redirect to login if no session
        // window.location.href = 'index.html';
        console.log('No user session found');
    }
    
    // Initialize tooltips and interactive elements
    initializeTooltips();
    
    // Set up real-time updates (mock)
    startRealTimeUpdates();
}

// Load audit data from API or mock data
function loadAuditData() {
    // Mock data for demonstration
    const mockData = {
        activeAudits: 12,
        completedAudits: 45,
        complianceScore: 94,
        pendingReviews: 7,
        recentAudits: [
            {
                id: 1,
                title: 'Manufacturing Facility A - GMP Audit',
                status: 'in-progress',
                startDate: '2024-03-15',
                type: 'GMP'
            },
            {
                id: 2,
                title: 'Distribution Center B - GDP Compliance',
                status: 'completed',
                completedDate: '2024-03-10',
                type: 'GDP'
            },
            {
                id: 3,
                title: 'Pharmacy Chain C - Quality Review',
                status: 'pending',
                submittedDate: '2024-03-08',
                type: 'Quality'
            }
        ]
    };
    
    updateDashboardStats(mockData);
    updateRecentAudits(mockData.recentAudits);
}

// Update dashboard statistics
function updateDashboardStats(data) {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = data.activeAudits;
        stats[1].textContent = data.completedAudits;
        stats[2].textContent = data.complianceScore + '%';
        stats[3].textContent = data.pendingReviews;
    }
}

// Update recent audits list
function updateRecentAudits(audits) {
    const auditList = document.querySelector('.audit-list');
    if (!auditList) return;
    
    auditList.innerHTML = audits.map(audit => `
        <div class="audit-item" data-audit-id="${audit.id}">
            <div class="audit-info">
                <h4>${audit.title}</h4>
                <p>Status: <span class="status ${audit.status}">${formatStatus(audit.status)}</span></p>
                <p class="audit-date">${formatAuditDate(audit)}</p>
            </div>
            <button class="btn-primary" onclick="viewAuditDetails(${audit.id})">
                ${getActionText(audit.status)}
            </button>
        </div>
    `).join('');
}

// Format status text
function formatStatus(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Format audit date based on status
function formatAuditDate(audit) {
    switch (audit.status) {
        case 'in-progress':
            return `Started: ${formatDate(audit.startDate)}`;
        case 'completed':
            return `Completed: ${formatDate(audit.completedDate)}`;
        case 'pending':
            return `Submitted: ${formatDate(audit.submittedDate)}`;
        default:
            return '';
    }
}

// Format date string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get action button text based on status
function getActionText(status) {
    switch (status) {
        case 'in-progress':
            return 'View Details';
        case 'completed':
            return 'View Report';
        case 'pending':
            return 'Review';
        default:
            return 'View';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

// Handle navigation clicks
function handleNavigation(event) {
    event.preventDefault();
    const target = event.target.getAttribute('href');
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    event.target.classList.add('active');
    
    // Handle different navigation targets
    switch (target) {
        case '#audits':
            showAuditsSection();
            break;
        case '#reports':
            showReportsSection();
            break;
        case '#compliance':
            showComplianceSection();
            break;
        case '#settings':
            showSettingsSection();
            break;
        case 'index.html':
            handleLogout();
            break;
    }
}

// Card hover effects
function handleCardHover(event) {
    event.target.style.transform = 'translateY(-5px) scale(1.02)';
}

function handleCardLeave(event) {
    event.target.style.transform = 'translateY(0) scale(1)';
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Start real-time updates (mock)
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time data updates
        updateLastRefresh();
    }, 30000); // Update every 30 seconds
}

// Update last refresh time
function updateLastRefresh() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    console.log(`Dashboard updated at ${timeString}`);
}

// Quick action functions
function startNewAudit() {
    alert('Starting new audit wizard...');
    // In a real app, this would open a modal or navigate to audit creation page
}

function generateReport() {
    alert('Opening report generator...');
    // In a real app, this would open report generation interface
}

function scheduleAudit() {
    alert('Opening audit scheduler...');
    // In a real app, this would open scheduling interface
}

function viewCompliance() {
    alert('Opening compliance dashboard...');
    // In a real app, this would show compliance metrics
}

// View audit details
function viewAuditDetails(auditId) {
    alert(`Opening details for audit ID: ${auditId}`);
    // In a real app, this would navigate to audit details page
}

// Section display functions
function showAuditsSection() {
    console.log('Showing audits section');
    // Implementation for showing audits
}

function showReportsSection() {
    console.log('Showing reports section');
    // Implementation for showing reports
}

function showComplianceSection() {
    console.log('Showing compliance section');
    // Implementation for showing compliance
}

function showSettingsSection() {
    console.log('Showing settings section');
    // Implementation for showing settings
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('pharmat_user');
        window.location.href = 'index.html';
    }
}

// Export functions for global access
window.startNewAudit = startNewAudit;
window.generateReport = generateReport;
window.scheduleAudit = scheduleAudit;
window.viewCompliance = viewCompliance;
window.viewAuditDetails = viewAuditDetails;