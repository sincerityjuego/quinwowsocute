// GeoVision Main JavaScript
// Handles all interactive features and UI behaviors

class GeoVision {
    constructor() {
        this.currentLocation = 'Camarines Norte, Philippines';
        this.isRiskOverlayEnabled = false;
        this.is3DMode = false;
        this.zoomLevel = 1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeChat();
        this.loadLocationData();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation(searchInput.value);
            }
        });
        
        // View mode toggle
        const viewModeBtn = document.getElementById('viewModeBtn');
        viewModeBtn.addEventListener('click', () => this.toggleViewMode());
        
        // Layers panel
        const layersBtn = document.getElementById('layersBtn');
        const layersPanel = document.getElementById('layersPanel');
        const closeLayersBtn = document.getElementById('closeLayersBtn');
        
        layersBtn.addEventListener('click', () => {
            layersPanel.classList.toggle('active');
        });
        
        closeLayersBtn.addEventListener('click', () => {
            layersPanel.classList.remove('active');
        });
        
        // Risk overlay toggle
        const riskToggle = document.getElementById('riskToggle');
        const riskLegend = document.getElementById('riskLegend');
        
        riskToggle.addEventListener('change', (e) => {
            this.isRiskOverlayEnabled = e.target.checked;
            if (e.target.checked) {
                riskLegend.classList.add('active');
                this.showRiskOverlay();
            } else {
                riskLegend.classList.remove('active');
                this.hideRiskOverlay();
            }
        });
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        
        zoomInBtn.addEventListener('click', () => this.zoom(0.1));
        zoomOutBtn.addEventListener('click', () => this.zoom(-0.1));
        
        // Data section close
        const closeDataBtn = document.getElementById('closeDataBtn');
        const dataSection = document.getElementById('dataSection');
        
        closeDataBtn.addEventListener('click', () => {
            dataSection.style.display = 'none';
            setTimeout(() => {
                dataSection.style.display = 'flex';
            }, 300);
        });
        
        // AI chat
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Quick questions
        const quickQuestionBtns = document.querySelectorAll('.quick-question-btn');
        quickQuestionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                chatInput.value = e.target.textContent;
                this.sendMessage();
            });
        });
        
        // AI expand button
        const expandAiBtn = document.getElementById('expandAiBtn');
        expandAiBtn.addEventListener('click', () => this.expandAIChat());
        
        // Map interaction
        const mapContainer = document.getElementById('mapContainer');
        mapContainer.addEventListener('click', (e) => this.handleMapClick(e));
        
        // Layer checkboxes
        const layerCheckboxes = document.querySelectorAll('.layer-item input[type="checkbox"]');
        layerCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const layerName = e.target.nextElementSibling.textContent;
                this.toggleLayer(layerName, e.target.checked);
            });
        });
    }
    
    searchLocation(query) {
        if (!query.trim()) return;
        
        console.log('Searching for:', query);
        this.currentLocation = query;
        
        // Update location display
        document.getElementById('selectedLocation').textContent = query;
        
        // Simulate loading new data
        this.loadLocationData();
        
        // Animate marker
        const marker = document.getElementById('locationMarker');
        marker.style.animation = 'none';
        setTimeout(() => {
            marker.style.animation = 'markerBounce 2s ease-in-out infinite';
        }, 10);
        
        // Show notification
        this.showNotification(`Location updated: ${query}`);
    }
    
    toggleViewMode() {
        this.is3DMode = !this.is3DMode;
        const viewModeBtn = document.getElementById('viewModeBtn');
        const btnText = viewModeBtn.querySelector('span');
        
        if (this.is3DMode) {
            btnText.textContent = '2D View';
            this.enable3DMode();
        } else {
            btnText.textContent = '3D View';
            this.disable3DMode();
        }
        
        this.showNotification(`Switched to ${this.is3DMode ? '3D' : '2D'} view`);
    }
    
    enable3DMode() {
        const mapContainer = document.querySelector('.map-placeholder');
        mapContainer.style.transform = 'perspective(1000px) rotateX(45deg)';
        mapContainer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    disable3DMode() {
        const mapContainer = document.querySelector('.map-placeholder');
        mapContainer.style.transform = 'perspective(1000px) rotateX(0deg)';
    }
    
    zoom(delta) {
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
        const mapGrid = document.querySelector('.map-grid');
        mapGrid.style.transform = `scale(${this.zoomLevel})`;
        mapGrid.style.transition = 'transform 0.3s ease-out';
        
        console.log('Zoom level:', this.zoomLevel);
    }
    
    showRiskOverlay() {
        console.log('Risk overlay enabled');
        // In a real implementation, this would show risk zones on the map
        this.showNotification('Risk overlay enabled');
    }
    
    hideRiskOverlay() {
        console.log('Risk overlay disabled');
        this.showNotification('Risk overlay disabled');
    }
    
    handleMapClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log('Map clicked at:', x, y);
        
        // Move marker to clicked position
        const marker = document.getElementById('locationMarker');
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        
        // Simulate loading location info
        this.loadLocationData();
    }
    
    toggleLayer(layerName, enabled) {
        console.log(`Layer "${layerName}" ${enabled ? 'enabled' : 'disabled'}`);
        this.showNotification(`${layerName}: ${enabled ? 'ON' : 'OFF'}`);
    }
    
    loadLocationData() {
        // Simulate loading location-specific data
        // In a real app, this would fetch from an API
        
        const locations = {
            'Camarines Norte, Philippines': {
                population: '583,313',
                floodRisk: 'High',
                infrastructure: 'Moderate',
                seismicActivity: 'Moderate',
                events: [
                    { date: 'Jan 2025', text: 'Flooding in low-lying areas' },
                    { date: 'Dec 2024', text: 'Typhoon warnings issued' }
                ]
            },
            default: {
                population: 'N/A',
                floodRisk: 'Unknown',
                infrastructure: 'Unknown',
                seismicActivity: 'Unknown',
                events: []
            }
        };
        
        const data = locations[this.currentLocation] || locations.default;
        
        // Update UI with data
        document.getElementById('population').textContent = data.population;
        
        // Update metrics
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics[1]) {
            metrics[1].textContent = data.floodRisk;
            metrics[1].className = 'metric-value risk-indicator ' + 
                (data.floodRisk === 'High' ? 'high' : 'moderate');
        }
        if (metrics[2]) metrics[2].textContent = data.infrastructure;
        if (metrics[3]) {
            metrics[3].textContent = data.seismicActivity;
            metrics[3].className = 'metric-value risk-indicator moderate';
        }
    }
    
    initializeChat() {
        // AI chat is already initialized with welcome message
        console.log('AI VISION initialized');
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 1000);
    }
    
    addMessageToChat(text, type) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';
        
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-text">${text}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple response logic
        if (message.includes('population')) {
            return `According to the latest data, ${this.currentLocation} has a population of approximately 583,313 people. The population density varies across municipalities, with urban areas showing higher concentration.`;
        } else if (message.includes('disaster') || message.includes('history')) {
            return `${this.currentLocation} has experienced several natural disasters, primarily typhoons and flooding. Recent significant events include flooding in January 2025 and typhoon warnings in December 2024. The area is also subject to seismic activity due to its location in the Pacific Ring of Fire.`;
        } else if (message.includes('infrastructure')) {
            return `Infrastructure in ${this.currentLocation} is rated as moderate. Priority improvements include drainage systems, flood barriers, and road network enhancement. The region would benefit from upgraded evacuation routes and emergency response facilities.`;
        } else {
            return `I can help you with information about ${this.currentLocation}. You can ask me about population statistics, disaster history, infrastructure conditions, risk assessments, or proposed solutions for the area.`;
        }
    }
    
    expandAIChat() {
        const aiSection = document.getElementById('aiSection');
        const dataSection = document.getElementById('dataSection');
        
        if (aiSection.style.height === '100%') {
            aiSection.style.height = '400px';
            dataSection.style.display = 'flex';
        } else {
            aiSection.style.height = '100%';
            dataSection.style.display = 'none';
        }
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--tertiary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px 20px;
            color: var(--text-primary);
            font-size: 0.9rem;
            box-shadow: var(--shadow-md);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification animations to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new GeoVision();
    console.log('GeoVision platform initialized');
    
    // Make app globally accessible for debugging
    window.geoVision = app;
});
