// Simple Plant Tracker App
let currentRole = localStorage.getItem('role') || null;
let plants = [];
let rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office'];

// Initialize app
function init() {
    if (!currentRole) {
        showRoleSelector();
    } else {
        showDashboard();
    }
    loadPlants();
}

// Show role selection screen
function showRoleSelector() {
    document.getElementById('app').innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-6">
            <h1 class="text-3xl font-bold mb-6">Welcome to Plant Tracker!</h1>
            <p class="mb-6 text-gray-600">Choose who you are:</p>
            <div class="space-y-3">
                ${['Ben', 'Jared', 'Guest1', 'Guest2'].map(role => `
                    <button onclick="selectRole('${role}')" 
                            class="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium">
                        ${role}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Select role and save
function selectRole(role) {
    currentRole = role;
    localStorage.setItem('role', role);
    showDashboard();
}

// Show main dashboard
function showDashboard() {
    const dueCount = plants.filter(p => p.daysUntilWater <= 0).length;
    const checkCount = plants.filter(p => p.daysUntilWater > 0 && p.daysUntilWater <= 2).length;
    
    document.getElementById('app').innerHTML = `
        <div class="max-w-6xl mx-auto p-4">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">🌱 Plant Tracker</h1>
                    <span class="text-gray-600">Hi, ${currentRole}!</span>
                </div>
            </div>

            <!-- Status Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-red-100 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-red-600">${dueCount}</div>
                    <div class="text-sm text-red-800">Need Water</div>
                </div>
                <div class="bg-yellow-100 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-yellow-600">${checkCount}</div>
                    <div class="text-sm text-yellow-800">Check Soon</div>
                </div>
                <div class="bg-green-100 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-green-600">${plants.filter(p => p.daysUntilWater > 2).length}</div>
                    <div class="text-sm text-green-800">Doing OK</div>
                </div>
                <div class="bg-blue-100 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-blue-600">${plants.length}</div>
                    <div class="text-sm text-blue-800">Total Plants</div>
                </div>
            </div>

            <!-- Add Plant Button -->
            <button onclick="showAddPlantForm()" 
                    class="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium mb-6">
                + Add New Plant
            </button>

            <!-- Plants List -->
            <div class="space-y-4">
                ${plants.length === 0 ? `
                    <div class="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                        <p class="text-xl mb-2">No plants yet!</p>
                        <p>Click "Add New Plant" to get started</p>
                    </div>
                ` : plants.map(plant => `
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3 class="font-bold text-lg">${plant.nickname || plant.species}</h3>
                                <p class="text-gray-600">${plant.species} in ${plant.room}</p>
                                <p class="text-sm text-gray-500 mt-1">
                                    Light: ${plant.lightLevel} | 
                                    Water every ${plant.waterInterval} days
                                </p>
                            </div>
                            <div class="text-right">
                                ${plant.daysUntilWater <= 0 ? `
                                    <span class="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                                        Water Now!
                                    </span>
                                ` : plant.daysUntilWater <= 2 ? `
                                    <span class="inline-block px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                                        Check in ${plant.daysUntilWater} days
                                    </span>
                                ` : `
                                    <span class="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                                        OK for ${plant.daysUntilWater} days
                                    </span>
                                `}
                                <div class="mt-2">
                                    <button onclick="waterPlant('${plant.id}')" 
                                            class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                        💧 Water
                                    </button>
                                    <button onclick="deletePlant('${plant.id}')" 
                                            class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 ml-2">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Footer Actions -->
            <div class="mt-8 pt-4 border-t text-center">
                <button onclick="changeRole()" class="text-gray-500 hover:text-gray-700 text-sm">
                    Change Role
                </button>
                <span class="mx-2 text-gray-400">|</span>
                <button onclick="exportData()" class="text-gray-500 hover:text-gray-700 text-sm">
                    Export Data
                </button>
                <span class="mx-2 text-gray-400">|</span>
                <button onclick="clearAllData()" class="text-red-500 hover:text-red-700 text-sm">
                    Clear All Data
                </button>
            </div>
        </div>
    `;
}

// Show add plant form
function showAddPlantForm() {
    if (plants.length >= 50) {
        alert('Maximum 50 plants allowed!');
        return;
    }

    document.getElementById('app').innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 class="text-2xl font-bold mb-6">Add New Plant</h2>
            <form onsubmit="addPlant(event)">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Plant Species *</label>
                    <input type="text" id="species" required 
                           class="w-full p-2 border rounded-lg" 
                           placeholder="e.g., Monstera, Snake Plant">
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Nickname (optional)</label>
                    <input type="text" id="nickname" 
                           class="w-full p-2 border rounded-lg" 
                           placeholder="e.g., Monty">
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Room *</label>
                    <select id="room" required class="w-full p-2 border rounded-lg">
                        ${rooms.map(room => `<option value="${room}">${room}</option>`).join('')}
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Light Level *</label>
                    <select id="lightLevel" required class="w-full p-2 border rounded-lg">
                        <option value="low">Low Light</option>
                        <option value="medium">Medium Light</option>
                        <option value="bright">Bright Light</option>
                        <option value="direct">Direct Sunlight</option>
                    </select>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2">Water Every (days) *</label>
                    <input type="number" id="waterInterval" required 
                           class="w-full p-2 border rounded-lg" 
                           min="1" max="60" value="7">
                </div>
                
                <div class="flex gap-2">
                    <button type="submit" 
                            class="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Add Plant
                    </button>
                    <button type="button" onclick="showDashboard()" 
                            class="flex-1 p-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Add a new plant
function addPlant(event) {
    event.preventDefault();
    
    const plant = {
        id: Date.now().toString(),
        species: document.getElementById('species').value,
        nickname: document.getElementById('nickname').value,
        room: document.getElementById('room').value,
        lightLevel: document.getElementById('lightLevel').value,
        waterInterval: parseInt(document.getElementById('waterInterval').value),
        lastWatered: new Date().toISOString(),
        addedBy: currentRole,
        addedDate: new Date().toISOString()
    };
    
    plants.push(plant);
    savePlants();
    showDashboard();
}

// Water a plant
function waterPlant(plantId) {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
        plant.lastWatered = new Date().toISOString();
        savePlants();
        showDashboard();
        
        // Show success message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
        message.textContent = `✅ ${plant.nickname || plant.species} watered by ${currentRole}!`;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Delete a plant
function deletePlant(plantId) {
    if (confirm('Are you sure you want to remove this plant?')) {
        plants = plants.filter(p => p.id !== plantId);
        savePlants();
        showDashboard();
    }
}

// Calculate days until water needed
function calculateDaysUntilWater(plant) {
    const lastWatered = new Date(plant.lastWatered);
    const now = new Date();
    const daysSince = Math.floor((now - lastWatered) / (1000 * 60 * 60 * 24));
    return plant.waterInterval - daysSince;
}

// Load plants from localStorage
function loadPlants() {
    const stored = localStorage.getItem('plants');
    if (stored) {
        plants = JSON.parse(stored);
        // Update days until water for each plant
        plants = plants.map(plant => ({
            ...plant,
            daysUntilWater: calculateDaysUntilWater(plant)
        }));
        // Sort by urgency
        plants.sort((a, b) => a.daysUntilWater - b.daysUntilWater);
    }
}

// Save plants to localStorage
function savePlants() {
    localStorage.setItem('plants', JSON.stringify(plants));
}

// Change role
function changeRole() {
    currentRole = null;
    localStorage.removeItem('role');
    showRoleSelector();
}

// Export data as JSON
function exportData() {
    const data = {
        exportDate: new Date().toISOString(),
        currentRole: currentRole,
        plants: plants,
        rooms: rooms
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plant-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

// Clear all data
function clearAllData() {
    if (confirm('This will delete all plants and reset the app. Are you sure?')) {
        localStorage.clear();
        plants = [];
        currentRole = null;
        init();
    }
}

// Start the app
init();
